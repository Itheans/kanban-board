import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  const { title, description, columnId, boardId, tags, priority = 'medium' } = await readBody(event)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  if (!title || !columnId || !boardId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title, columnId, and boardId are required'
    })
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    
    // Check if user has access to the board
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        OR: [
          { ownerId: decoded.userId },
          {
            members: {
              some: {
                userId: decoded.userId
              }
            }
          }
        ]
      }
    })
    
    if (!board) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied to this board'
      })
    }
    
    // Get the highest order in the column
    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' }
    })
    
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim() !== '') : [],
        priority,
        order: (lastTask?.order || 0) + 1,
        boardId,
        columnId,
        assignee: decoded.userId
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })
    
    return { success: true, task }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }
    
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to create task'
    })
  } finally {
    await prisma.$disconnect()
  }
})