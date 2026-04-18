import { Router } from 'express';
import { createUser, getUsers, getUserById } from '../controllers/users.controller';
import handleRequest from "../utils/handleRequest";

const router = Router();

router.post('/create', handleRequest(createUser));
router.get('/get', handleRequest(getUsers));
router.get('/get/:id', handleRequest(getUserById));

export default router;
