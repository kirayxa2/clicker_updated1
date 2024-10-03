import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = 
     globalForPrisma.prisma ||
     new PrismaClient({
        log: ['query'],
     })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(req: NextRequest) {
    try {
        const { telegramId } = await req.json()

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 })
        }

        const updateUser = await prisma.user.update({
            where: { telegramId },
            data: { points: { increment: 1 } }
        })

        return NextResponse.json({ success: true, points: updateUser.points })
    } catch (error) {
        console.error('Error increasing points:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}