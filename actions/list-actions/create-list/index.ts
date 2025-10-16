'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { InputType, ReturnType } from './types';
import { CreateList } from './schema';
import { createSafeAction } from '@/lib/create-safe-action';
import { createAutditLog } from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, boardId } = data;
  let list;

  try {
    const board = await db.board.findUnique({
      where: { id: boardId, orgId },
    });

    if (!board) {
      return {
        error: 'Board not found',
      };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 0;

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });
    await createAutditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.List,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to create.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}

export const createList = createSafeAction(CreateList, handler);
