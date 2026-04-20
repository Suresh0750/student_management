import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    tamil: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    english: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    maths: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    physics: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    chemistry: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const Marks = mongoose.model("Marks", marksSchema);

export default Marks;