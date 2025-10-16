'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

import { revalidatePath } from 'next/cache';

import { InputType, ReturnType } from './types';
import { DeleteList } from './schema';
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

  const { id, boardId } = data;
  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });
    await createAutditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.List,
      action: ACTION.DELETE,
    });
  } catch {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}

export const deletelist = createSafeAction(DeleteList, handler);
