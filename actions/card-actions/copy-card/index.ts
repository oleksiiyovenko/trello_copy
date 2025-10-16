'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

import { revalidatePath } from 'next/cache';

import { InputType, ReturnType } from './types';
import { CopyCard } from './schema';
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
  let card;

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) {
      return {
        error: 'Card not found.',
      };
    }

    const lastCard = await db.card.findFirst({
      where: {
        listId: cardToCopy.listId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      },
    });

    await createAutditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.Card,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: 'Failed to Copy.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const copyCard = createSafeAction(CopyCard, handler);
