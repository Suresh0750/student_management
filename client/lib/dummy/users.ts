import { IUser } from "../types";



export type StudentMarkRow = {
  _id: number;
  name: string;
  tamil: number;
  english: number;
  maths: number;
  physics: number;
  chemistry: number;
};

export const students: IUser[] = [
  {
    _id: "1",
    name: "Aarav Kumar",
    email: "aarav.kumar@example.com",
    phone: "+91 90000 11111",
  },
  {
    _id: "2",
    name: "Meera Sharma",
    email: "meera.sharma@example.com",
    phone: "+91 90000 22222",
  },
  {
    _id: "3",
    name: "Riya Das",
    email: "riya.das@example.com",
    phone: "+91 90000 33333",
  },
];

export const teachers: IUser[] = [
  {
    _id: "101",
    name: "Anita Rao",
    email: "anita.rao@example.com",
    phone: "+91 98888 11111",
  },
  {
    _id: "102",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91 98888 22222",
  },
  {
    _id: "103",
    name: "Nikhil Verma",
    email: "nikhil.verma@example.com",
    phone: "+91 98888 33333",
  },
];


export const studentMarks: StudentMarkRow[] = [
  {
    _id: 1,
    name: "Aarav Kumar",
    tamil: 85,
    english: 78,
    maths: 92,
    physics: 89,
    chemistry: 88,
  },
  {
    _id: 2,
    name: "Meera Sharma",
    tamil: 90,
    english: 82,
    maths: 87,
    physics: 85,
    chemistry: 91,
  },
  {
    _id: 3,
    name: "Riya Das",
    tamil: 75,
    english: 80,
    maths: 70,
    physics: 72,
    chemistry: 78,
  },
];