'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

import { revalidatePath } from 'next/cache';

import { InputType, ReturnType } from './types';
import { DeleteList } from './schema';
import { createSafeAction } from '@/lib/create-safe-action';

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
  } catch {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}

export const deletelist = createSafeAction(DeleteList, handler);
