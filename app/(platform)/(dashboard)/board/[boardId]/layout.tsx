import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { startCase } from 'lodash';
import { notFound, redirect } from 'next/navigation';
import { BoardNavbar } from './_components/board-navbar';

export async function generateMetadata({
  params,
}: {
  params: {
    boardId: string;
  };
}) {
  const { orgId } = await auth();
  const param = await params;

  if (!orgId) {
    return {
      title: 'Board',
    };
  }

  const board = await db.board.findUnique({
    where: {
      id: param.boardId,
      orgId,
    },
  });

  return {
    title: startCase(board?.title || 'Board'),
  };
}

export default async function BoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    boardId: string;
  };
}) {
  const { orgId } = await auth();
  const param = await params;

  if (!orgId) {
    redirect('/select-org');
  }

  const board = await db.board.findUnique({
    where: {
      id: param.boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className='relative h-full bg-no-repeat bg-cover bg-center'
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className='absolute inset-0 bg-black/10' />
      <main className='relative h-full'>{children}</main>
    </div>
  );
}
