import { Request, Response } from 'express';
import { signupService, loginService } from '../services/authService';

export const signup = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, password, full_name } = req.body;

        if (!phoneNumber || !password) {
            res.status(400).json({ message: 'Phone number and password are required' });
            return;
        }

        const owner = await signupService(req);

        if (!owner) {
            res.status(400).json({ message: 'Owner already exists with this phone number' });
            return;
        }
        
        res.status(201).json({ message: 'Signup successful', data: owner });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            res.status(400).json({ message: 'Phone number and password are required' });
            return;
        }

        const loginInfo = await loginService(phoneNumber, password);

        if (!loginInfo) {
            res.status(401).json({ message: 'Invalid phone number or password' });
            return;
        }

        const { accessToken, refreshToken, owner } = loginInfo as { accessToken: string; refreshToken: string; owner: any };

        res.status(200).json({
            token: accessToken,
            refreshToken,
            owner: owner,
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
