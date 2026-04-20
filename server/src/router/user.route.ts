import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/users.controller';
import handleRequest from "../utils/handleRequest";
import { verifyToken } from '../middleware/verifyToken';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { IAccessRole } from '../utils/common';

const router = Router();

router.post('/create', verifyToken, authorizeRoles([IAccessRole.ADMIN]), handleRequest(createUser));
router.put('/update/:userId', verifyToken, authorizeRoles([IAccessRole.ADMIN]), handleRequest(updateUser));
router.get('/get', verifyToken, authorizeRoles([IAccessRole.ADMIN, IAccessRole.TEACHER]), handleRequest(getUsers));
router.delete('/delete/:userId', verifyToken, authorizeRoles([IAccessRole.ADMIN]), handleRequest(deleteUser));
router.get('/:id', handleRequest(getUserById));

export default router;
