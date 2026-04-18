import express,{Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import DBConnect from './config/database';
import userRouter from './router/user.route';
import authRouter from './router/auth.route';
dotenv.config();

DBConnect();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 3002


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});