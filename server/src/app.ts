import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import DBConnect from './config/database';
import userRouter from './router/user.route';
import authRouter from './router/auth.route';
import errorHandler from "./middleware/errorHandler";
import { HttpStatusCode } from "./interface/utils";
import { AppError } from "./utils/AppError";
dotenv.config();

DBConnect();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(new AppError("Route not found", HttpStatusCode.NOT_FOUND))
);
app.use(errorHandler);

const PORT = process.env.PORT || 3002


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});