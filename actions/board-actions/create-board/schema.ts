import z from 'zod';

export const CreateBoard = z.object({
  title: z
    .string()
    .min(3, { message: 'Minimum length of 3 letters is required' }),
  image: z
    .string({ message: 'Image is required' })
    .nonempty({ message: 'Image is required' }),
});
