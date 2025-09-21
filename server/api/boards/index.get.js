import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - No token provided'
    })
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    
    const boards = await prisma.board.findMany({
      where: {
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
        owner: {
          select: {
            username: true,
            email: true
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return { boards }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch boards'
    })
  } finally {
    await prisma.$disconnect()
  }
})