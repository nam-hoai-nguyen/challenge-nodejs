import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Route thử nghiệm
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Node.js + Express + TypeScript!');
});

export default app;
