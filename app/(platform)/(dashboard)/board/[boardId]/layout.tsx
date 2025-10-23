import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { startCase } from 'lodash';
import { notFound, redirect } from 'next/navigation';
import { BoardNavbar } from './_components/board-navbar';
import { Navbar } from '../../_components/navbar';

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    boardId: string;
  }>;
}) {
  const { orgId } = await auth();
  const { boardId } = await params;

  if (!orgId) {
    return {
      title: 'Board',
    };
  }

  const board = await db.board.findUnique({
    where: {
      id: boardId,
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
  params: Promise<{
    boardId: string;
  }>;
}) {
  const { orgId } = await auth();
  const { boardId } = await params;

  if (!orgId) {
    redirect('/select-org');
  }

  const board = await db.board.findUnique({
    where: {
      id: boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div className='h-full'>
      <Navbar width_full />
      <div
        className='relative h-[calc(100%-var(--spacing)*14)] bg-no-repeat bg-cover bg-center'
        style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      >
        <BoardNavbar data={board} />
        <div className='absolute inset-0 bg-black/10' />
        <main className='relative h-[calc(100%-var(--spacing)*14)]'>
          {children}
        </main>
      </div>
    </div>
  );
}
