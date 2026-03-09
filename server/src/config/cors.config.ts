const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

export const corsOptions = {
	origin: allowedOrigins,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
