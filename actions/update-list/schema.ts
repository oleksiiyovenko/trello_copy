import z from 'zod';

export const UpdateList = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  id: z.string(),
  boardId: z.string(),
});
