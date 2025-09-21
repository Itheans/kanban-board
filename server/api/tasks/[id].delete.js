import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const taskId = getRouterParam(event, 'id')
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    
    // Check if task exists and user has access
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        board: {
          include: {
            members: true
          }
        }
      }
    })
    
    if (!existingTask) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Task not found'
      })
    }
    
    // Check if user has access to the board
    const hasAccess = existingTask.board.ownerId === decoded.userId || 
                     existingTask.board.members.some(member => member.userId === decoded.userId)
    
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
    
    await prisma.task.delete({
      where: { id: taskId }
    })
    
    return { success: true, message: 'Task deleted successfully' }
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
      statusMessage: 'Failed to delete task'
    })
  } finally {
    await prisma.$disconnect()
  }
})