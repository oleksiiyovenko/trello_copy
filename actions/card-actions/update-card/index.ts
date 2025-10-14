'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { InputType, ReturnType } from './types';
import { UpdateCard } from './schema';
import { createSafeAction } from '@/lib/create-safe-action';

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, boardId, ...values } = data;
  let card;

  try {
    card = await db.card.update({
      where: {
        id,
        list: { board: { orgId } },
      },
      data: {
        ...values,
      },
    });
  } catch {
    return {
      error: 'Failed to update.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const updateCard = createSafeAction(UpdateCard, handler);
