import express, { type Request, type Response } from 'express';
import { connectToDatabase } from './database/sequelize.js';
import routes from './routes/index.js';
import cors from 'cors';
import { corsOptions } from './config/cors.config.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// api routes
app.use('/api', routes);

app.get('/health', (req: Request, res: Response) => {
	res.send({ message: 'health check' });
});

connectToDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running at http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.error('Unable to connect to the database:', (error as Error).message);
		process.exit(1);
	});
