// app.ts
import express from 'express';
import accountRoutes from './routes/accounts';
import authRoutes from './routes/authRoutes';
import { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => res.send('API running'));

app.use('/accounts', accountRoutes);
app.use('/auth', authRoutes);

export default app;
