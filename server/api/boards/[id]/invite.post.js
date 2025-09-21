import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const boardId = getRouterParam(event, 'id')
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  const { email } = await readBody(event)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required'
    })
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    
    // Check if user is board owner
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        ownerId: decoded.userId
      }
    })
    
    if (!board) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only board owner can invite members'
      })
    }
    
    // Find user to invite
    const userToInvite = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    })
    
    if (!userToInvite) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User with this email not found'
      })
    }
    
    // Check if user is already a member
    const existingMember = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: userToInvite.id
        }
      }
    })
    
    if (existingMember) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User is already a member of this board'
      })
    }
    
    // Add user to board
    const member = await prisma.boardMember.create({
      data: {
        boardId,
        userId: userToInvite.id,
        role: 'member'
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
    
    return { 
      success: true, 
      member,
      message: `Successfully invited ${userToInvite.username} to the board`
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
      statusCode: 400,
      statusMessage: 'Failed to invite user'
    })
  } finally {
    await prisma.$disconnect()
  }
})