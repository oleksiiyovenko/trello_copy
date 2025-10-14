import z from 'zod';

export const CreateBoard = z.object({
  title: z
    .string()
    .nonempty({ message: 'Title is required' })
    .min(3, { message: 'Minimum length of 3 letters is required' }),
  image: z.string().nonempty({ message: 'Image is required' }),
});
