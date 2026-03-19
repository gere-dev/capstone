import type z from 'zod';

export const formatZodErrors = (error: z.ZodError) => {
	const errors: Record<string, string> = {};
	error.issues.forEach((issue: any) => {
		const key = issue.path[0] as string;
		errors[key] = issue.message;
	});
	return errors;
};

export const mapBackendZodErrors = (error: any) => {
	const issues = error?.errors;

	if (!Array.isArray(issues)) return null;

	const mapped: Record<string, string> = {};

	for (const issue of issues) {
		const field = issue?.path?.[0];
		const message = issue?.message;
		if (field && message) mapped[field] = message;
	}

	return Object.keys(mapped).length > 0 ? mapped : null;
};
