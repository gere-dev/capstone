import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
export const sanitized = (schema: z.ZodString) =>
	schema.transform((val) => {
		const clean = sanitizeHtml(val, {
			allowedTags: [],
			allowedAttributes: {},
		});

		if (clean.trim().length === 0) {
			throw new Error('Invalid input.');
		}

		return clean;
	});

export const sanitizedPhone = sanitized(z.string().regex(/^[0-9+\-()/\s]+$/, 'Invalid phone number format'));
