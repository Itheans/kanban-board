import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const taskId = getRouterParam(event, 'id')
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  const updateData = await readBody(event)
  
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
    
    // Prepare update data
    const allowedFields = ['title', 'description', 'columnId', 'tags', 'priority', 'order']
    const filteredUpdateData = {}
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'title' && value) {
          filteredUpdateData[key] = value.trim()
        } else if (key === 'description') {
          filteredUpdateData[key] = value?.trim() || null
        } else if (key === 'tags' && Array.isArray(value)) {
          filteredUpdateData[key] = value.filter(tag => tag.trim() !== '')
        } else {
          filteredUpdateData[key] = value
        }
      }
    }
    
    const task = await prisma.task.update({
      where: { id: taskId },
      data: filteredUpdateData,
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
      statusMessage: 'Failed to update task'
    })
  } finally {
    await prisma.$disconnect()
  }
})