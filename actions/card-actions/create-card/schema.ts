import z from 'zod';

export const CreateCard = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  boardId: z.string(),
  listId: z.string(),
});
