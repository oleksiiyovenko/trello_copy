import z from 'zod';

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.optional(
    z
      .string('Description is required')
      .nonempty('Description is required')
      .min(3, { message: 'Description is too short' })
  ),
  title: z.optional(
    z
      .string()
      .nonempty({ message: 'Title is required' })
      .min(3, { message: 'Title is too short' })
  ),
  id: z.string(),
});
