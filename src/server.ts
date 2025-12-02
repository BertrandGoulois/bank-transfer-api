import express from 'express';
import authRoutes from './interface/http/routes/authRoutes';
import userRoutes from './interface/http/routes/userRoutes';
import accountRoutes from './interface/http/routes/accountRoutes';
import transactionRoutes from './interface/http/routes/transactionRoutes';
import requestLogger from './interface/http/middleware/requestLogger';
import authMiddleware from './interface/http/middleware/authMiddleware';
import errorHandler from './interface/http/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/accounts', authMiddleware, accountRoutes);
app.use('/transactions', authMiddleware, transactionRoutes);

app.use(errorHandler);

app.listen(3000, () => console.log('Server running on port 3000'));
