import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  const { title, description } = await readBody(event)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  if (!title || title.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title is required'
    })
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    
    const board = await prisma.board.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        ownerId: decoded.userId,
        columns: {
          create: [
            { title: 'To Do', order: 1 },
            { title: 'In Progress', order: 2 },
            { title: 'Done', order: 3 }
          ]
        }
      },
      include: {
        columns: {
          orderBy: { order: 'asc' }
        },
        owner: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })
    
    return { success: true, board }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }
    
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to create board'
    })
  } finally {
    await prisma.$disconnect()
  }
})