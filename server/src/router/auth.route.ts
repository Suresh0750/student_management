import { Router } from 'express';   
import { login } from '../controllers/auth.controller';
import { ValidateType } from '../interface/utils';
import validate from "../middleware/validator"
import { loginSchema } from '../validations/auth.validation';
import handleRequest from "../utils/handleRequest";

const authRouter = Router();

authRouter.post('/login', validate(loginSchema, ValidateType.BODY), handleRequest(login));

export default authRouter;