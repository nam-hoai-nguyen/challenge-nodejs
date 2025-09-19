import express, { Application } from "express";
import routes from "./routes";
import { errorHandler } from './presentation/http/middleware/errorHandler';
import { requestId } from './presentation/http/middleware/requestId';
import {devTestRoute} from "./presentation/http/routes/devTestRoute";
import { userV2Routes } from './presentation/http/routes/userV2Routes';
import { routerV2 } from "./presentation/http/routes/routerV2";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use(requestId);
app.use('/dev-test', devTestRoute);

app.use('/v2/users', userV2Routes);
app.use('/api/v2', routerV2);
app.use(errorHandler);
export default app;
