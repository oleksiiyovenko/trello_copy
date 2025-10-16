'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { InputType, ReturnType } from './types';
import { UpdateBoard } from './schema';
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

  const { title, id } = data;
  let board;

  try {
    board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });
    await createAutditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.Board,
      action: ACTION.UPDATE,
    });
  } catch {
    return {
      error: 'Failed to update.',
    };
  }

  revalidatePath(`/board/${id}`);
  return { data: board };
}

export const updateBoard = createSafeAction(UpdateBoard, handler);
