import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const boardId = getRouterParam(event, 'id')
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    
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
      },
      include: {
        columns: {
          orderBy: { order: 'asc' }
        },
        tasks: {
          orderBy: { order: 'asc' },
          include: {
            user: {
              select: {
                username: true,
                email: true
              }
            }
          }
        },
        owner: {
          select: {
            username: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                username: true,
                email: true
              }
            }
          }
        }
      }
    })
    
    if (!board) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found or access denied'
      })
    }
    
    return {
      board,
      columns: board.columns,
      tasks: board.tasks
    }
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
      statusCode: 500,
      statusMessage: 'Failed to fetch board'
    })
  } finally {
    await prisma.$disconnect()
  }
})