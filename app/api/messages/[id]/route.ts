import { db } from '@/db'
import { messages } from '@/db/schema'
import { getSession } from '@/lib/auth-server'
import { errorMsgs } from '@/lib/error'
import { getTenantId } from '@/lib/tenant'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const [
    session,
    storeId,
    {id}
  ] = await Promise.all([
    getSession(),
    getTenantId(),
    params
  ])
  if(!session) return NextResponse.json({ error: errorMsgs.NotAuthenticated }, { status: 400 })
  if(session.user_role !== "seller" || !session.stores.includes(storeId)) return NextResponse.json({ error: errorMsgs.NotAuthenticated }, { status: 400 })

  if (!id) return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })

  const body = await req.json()

  // Allow only selected fields to be updated
  const allowedFields = ['status', 'priority', 'isStarred', 'adminNotes', 'responseCount'] as const

  const updates: Partial<Record<(typeof allowedFields)[number], any>> = {}

  for (const key of allowedFields) {
    if (key in body) {
      updates[key] = body[key]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
  }

  try {
    await db
      .update(messages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(messages.id, id))

    const [updated] = await db.select().from(messages).where(eq(messages.id, id))

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}
