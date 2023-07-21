import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import { use } from 'react';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST'){
        return res.status(405).end();
    }

    try {
        const {email, name, password} = req.body;
        //check if there is any existing user with the same email
        const existingUser = await prismadb.user.findUnique({ 
            where: { email },
        });
        if(existingUser){
            return res.status(422).json({error : 'Email already exists'});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        //create the user
        const user = await prismadb.user.create({
            data:{
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });

        return res.status(200).json(user)
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}