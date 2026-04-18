import { TokenPayload } from "../interface/users";



export const ADMIN_EMAIL = 'admin@gmail.com';
export const ADMIN_PASSWORD = 'admin123';



export const adminCredentials : TokenPayload = {
    userId : "1234566",
    role : "ADMIN",
    name : "suresh",
    email : ADMIN_EMAIL,
}