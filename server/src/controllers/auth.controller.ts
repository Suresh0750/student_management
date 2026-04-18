

import { Request, Response } from 'express';
import User from '../models/user.schema';
import { generateToken } from '../utils/jwt';
import { ADMIN_EMAIL, ADMIN_PASSWORD, adminCredentials } from '../utils/common';

export const login = async (req: Request, res: Response) => {
    try{
        const { email=null, password=null} = req.body;
        // const user = await User.findOne({ email });

        if(email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD){
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // if(user.password !== password){
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Invalid password',
        //     });
        // }

        // const token = generateToken(user._id.toString(), user.role, user.name, user.email);

        const token = generateToken(adminCredentials);

        return res.status(200).json({
            success: true,
            // user,
            token,
            message: 'Login successful',
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error,
        });
    }
}
