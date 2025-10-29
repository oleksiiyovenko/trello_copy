import z from 'zod';

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.string().optional(),
  title: z.optional(
    z
      .string()
      .nonempty({ message: 'Title is required' })
      .min(3, { message: 'Title is too short' })
  ),
  id: z.string(),
});
