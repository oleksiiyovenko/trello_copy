'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

import { revalidatePath } from 'next/cache';

import { InputType, ReturnType } from './types';
import { DeleteCard } from './schema';
import { createSafeAction } from '@/lib/create-safe-action';

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });
  } catch {
    return {
      error: 'Failed to Delete.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const deleteCard = createSafeAction(DeleteCard, handler);
