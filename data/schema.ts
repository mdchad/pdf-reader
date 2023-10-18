import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const hadithSchema = z.object({
	id: z.string(),
	content: z.object({ en: z.string(), ms: z.string(), ar: z.string()}),
	chapter_id: z.string(),
	chapter_name: z.string(),
	chapter_title: z.object({ en: z.string(), ms: z.string(), ar: z.string()}),
	volume_id: z.string(),
	volume_name: z.string(),
	volume_title: z.object({ en: z.string(), ms: z.string(), ar: z.string()}),
	book_id: z.string(),
	book_name: z.string(),
	book_title: z.object({ en: z.string(), ms: z.string(), ar: z.string()})
});

export type Task = z.infer<typeof hadithSchema>;
