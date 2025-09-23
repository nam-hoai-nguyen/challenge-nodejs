import express, { Application } from 'express';
import { errorHandler } from './presentation/http/middleware/errorHandler';
import { requestId } from './presentation/http/middleware/requestId';
import { routerV2 } from './presentation/http/routes/routerV2';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestId);

app.use('/api/v2', routerV2);
app.use(errorHandler);
export default app;
