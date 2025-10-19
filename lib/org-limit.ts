import { auth } from '@clerk/nextjs/server';

import { db } from './db';
import { MAX_FREE_BOARDS } from '@/constants/boards';

export async function incrementAvailableCount() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (orgLimit) {
    if (orgLimit.count < 5) {
      await db.orgLimit.update({
        where: {
          orgId,
        },
        data: {
          count: orgLimit.count + 1,
        },
      });
    }
  } else {
    await db.orgLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
}

export async function decreaseAvailableCount() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  const numOfBoards = await db.board.count({ where: { orgId } });

  if (orgLimit) {
    if (numOfBoards < 5) {
      await db.orgLimit.update({
        where: {
          orgId,
        },
        data: {
          count: orgLimit.count > 0 ? orgLimit.count - 1 : 0,
        },
      });
    } else {
      await db.orgLimit.update({
        where: {
          orgId,
        },
        data: {
          count: 5,
        },
      });
    }
  } else {
    await db.orgLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
}

export async function hasAvailableCount() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
}

export async function getAvailableCount() {
  const { orgId } = await auth();

  if (!orgId) {
    return 0;
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });

  if (!orgLimit) {
    return 0;
  }

  return orgLimit.count;
}
