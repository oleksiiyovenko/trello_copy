import z from 'zod';

export const CreateList = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  // .min(1, { message: 'Title is to short' })
  boardId: z.string(),
});
