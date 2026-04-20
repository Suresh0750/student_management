import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../interface/utils";
import Marks from "../models/marks.schema";
import User from "../models/user.schema";

export const createMarks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { studentId, tamil, english, maths, physics, chemistry } = req.body;

        // Check student exists and is actually a STUDENT role
        const student = await User.findOne({ _id: studentId, role: "STUDENT", isDeleted: false });
        if (!student) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "Student not found",
            });
        }

        // Check marks already exist for this student
        const existingMarks = await Marks.findOne({ student: studentId, isDeleted: false });
        if (existingMarks) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "Marks already exist for this student",
            });
        }

        const marks = await Marks.create({
            student: studentId,
            tamil,
            english,
            maths,
            physics,
            chemistry,
        });

        const populated = await marks.populate("student", "name email phone");

        const formatted = {
            _id: populated._id,
            studentId: (populated.student as any)._id,
            name: (populated.student as any).name,
            email: (populated.student as any).email,
            phone: (populated.student as any).phone,
            tamil: populated.tamil,
            english: populated.english,
            maths: populated.maths,
            physics: populated.physics,
            chemistry: populated.chemistry,
            isDeleted: populated.isDeleted,
            createdAt: populated.createdAt,
            updatedAt: populated.updatedAt,
        };
        return res.status(HttpStatusCode.CREATED).json({
            success: true,
            marks: formatted,
            message: `Marks created successfully for ${student.name}`,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMarks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { markId } = req.params;
        const { tamil, english, maths, physics, chemistry } = req.body;

        const marks = await Marks.findOneAndUpdate(
            { _id: markId, isDeleted: false },
            { tamil, english, maths, physics, chemistry, updatedAt: Date.now() },
            { new: true }
        ).populate("student", "name email phone");

        if (!marks) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "Marks not found for this student",
            });
        }

        const student = marks.student as any;

        const formatted = {
            _id: marks._id,
            studentId: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            tamil: marks.tamil,
            english: marks.english,
            maths: marks.maths,
            physics: marks.physics,
            chemistry: marks.chemistry,
            isDeleted: marks.isDeleted,
            createdAt: marks.createdAt,
            updatedAt: marks.updatedAt,
        };

        return res.status(HttpStatusCode.SUCCESS).json({
            success: true,
            marks: formatted,
            message: "Marks updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getAllMarks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const marks = await Marks.find({ isDeleted: false })
            .populate("student", "name email phone");

        const formatted = marks.map(({ _id, student, tamil, english, maths, physics, chemistry, isDeleted, createdAt, updatedAt }: any) => ({
            _id,
            studentId: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            tamil,
            english,
            maths,
            physics,
            chemistry,
            isDeleted,
            createdAt,
            updatedAt,
        }));

        return res.status(HttpStatusCode.SUCCESS).json({
            success: true,
            marks: formatted,
        });
    } catch (error) {
        next(error);
    }
};


export const deleteMarks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { markId } = req.params;

        const marks = await Marks.findOneAndUpdate(
            { _id: markId, isDeleted: false },
            { isDeleted: true, updatedAt: Date.now() },
            { new: true }
        );

        if (!marks) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "Marks not found for this student",
            });
        }

        return res.status(HttpStatusCode.SUCCESS).json({
            success: true,
            message: "Marks deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};