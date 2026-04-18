import { Router } from 'express';
import { createUser, getUsers, getUserById } from '../controllers/users.controller';
import handleRequest from "../utils/handleRequest";
import { verifyToken } from '../middleware/verifyToken';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { IAccessRole } from '../utils/common';

const router = Router();

router.post('/create',verifyToken,authorizeRoles([IAccessRole.ADMIN]), handleRequest(createUser));
router.get('/get', handleRequest(getUsers));
router.get('/get/:id', handleRequest(getUserById));

export default router;
