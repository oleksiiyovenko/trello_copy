'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { InputType, ReturnType } from './types';
import { DeleteBoard } from './schema';
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

  const { id } = data;
  let board;

  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });
    await createAutditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.Board,
      action: ACTION.DELETE,
    });
  } catch {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
}

export const deleteBoard = createSafeAction(DeleteBoard, handler);
