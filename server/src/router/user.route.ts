import { Router } from 'express';
import { createUser, getUsers, getUserById ,updateUser} from '../controllers/users.controller';
import handleRequest from "../utils/handleRequest";
import { verifyToken } from '../middleware/verifyToken';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { IAccessRole } from '../utils/common';

const router = Router();

router.post('/create',verifyToken,authorizeRoles([IAccessRole.ADMIN]), handleRequest(createUser));
router.put('/update/:userId',verifyToken,authorizeRoles([IAccessRole.ADMIN]), handleRequest(updateUser));
router.get('/get', verifyToken,authorizeRoles([IAccessRole.ADMIN]),handleRequest(getUsers));
router.get('/get/:id', handleRequest(getUserById));

export default router;
