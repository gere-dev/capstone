import z from 'zod';

export const searchTermSchema = z.object({
	term: z.string().min(0).max(50),
});
