// routes/marks.route.ts
import { Router } from "express";
import { createMarks, updateMarks, getAllMarks, deleteMarks, getMarksByStudent } from "../controllers/marks.controller";
import { verifyToken } from "../middleware/verifyToken";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { IAccessRole } from "../utils/common";


const router = Router();

router.post("/", verifyToken, authorizeRoles([IAccessRole.TEACHER]), createMarks);               // POST /marks         → create
router.put("/:markId", verifyToken, authorizeRoles([IAccessRole.TEACHER]), updateMarks);      // PUT  /marks/:id     → update
router.get("/", verifyToken, authorizeRoles([IAccessRole.TEACHER]), getAllMarks);                 // GET  /marks         → list all
router.get("/:studentId", verifyToken, authorizeRoles([IAccessRole.STUDENT]), getMarksByStudent);                 // GET  /marks         → list all
router.get("/:studentId", verifyToken, authorizeRoles([IAccessRole.STUDENT]), getMarksByStudent);                 // GET  /marks         → list all
router.delete("/:markId", verifyToken, authorizeRoles([IAccessRole.TEACHER]), deleteMarks);
export default router;