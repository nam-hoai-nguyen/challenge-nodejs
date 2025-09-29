import express, { Application } from 'express';
import { errorHandler } from './presentation/http/middleware/errorHandler';
import { requestId } from './presentation/http/middleware/requestId';
import { authRoute } from './presentation/http/routes/authRoute';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestId);
app.use('/api', authRoute);
app.use(errorHandler);
export default app;
