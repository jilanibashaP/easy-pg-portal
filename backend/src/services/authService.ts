// authService.ts
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Owner } from '../models/Owner';

// Validate environment variables with fallbacks for development
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'fallback-access-secret-for-development-only';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret-for-development-only';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '1h';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Warn if using fallback secrets
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.warn('⚠️  WARNING: Using fallback JWT secrets. Set ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in production!');
}

export const signupService = async (req: Request): Promise<Owner | null> => {
    const { phoneNumber, password, firstName, lastName, email, address, city, state, pincode } = req.body;

    // Validate required fields
    if (!phoneNumber || !password || !firstName || !lastName || !email) {
        throw new Error('Required fields are missing');
    }

    // Check if the owner already exists
    const existingOwner = await Owner.findOne({ where: { phoneNumber } });
    if (existingOwner) {
        return null; // Owner already exists
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new owner
    const newOwner = await Owner.create({
        phoneNumber,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        address: address || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        isActive: true,
    });

    return newOwner;
};

interface JwtPayload {
    ownerId: string;
}

export const loginService = async (
    phoneNumber: string,
    password: string
): Promise<{ accessToken: string; refreshToken: string; owner: Owner } | null> => {
    // Validate inputs
    if (!phoneNumber || !password) {
        return null;
    }

    const owner = await Owner.findOne({
        where: { phoneNumber, isActive: true },
    });

    if (!owner) return null;

    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) return null;

    // Ensure ownerId is properly typed as string
    const ownerId = String(owner.id);
    if (!ownerId) {
        throw new Error("Owner ID is not defined");
    }

    // Create JWT payload with proper typing
    const payload: JwtPayload = { ownerId };

    const accessToken = jwt.sign(
        payload, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: ACCESS_TOKEN_EXPIRY } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
        payload, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: REFRESH_TOKEN_EXPIRY } as jwt.SignOptions
    );

    return { accessToken, refreshToken, owner };
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;

        // Optional: Verify the owner still exists and is active
        const owner = await Owner.findOne({
            where: { id: decoded.ownerId, isActive: true }
        });

        if (!owner) {
            res.status(403).json({ message: 'Owner not found or inactive' });
            return;
        }

        const payload: JwtPayload = { ownerId: decoded.ownerId };
        const newAccessToken = jwt.sign(
            payload, 
            ACCESS_TOKEN_SECRET, 
            { expiresIn: ACCESS_TOKEN_EXPIRY } as jwt.SignOptions
        );

        res.status(200).json({ accessToken: newAccessToken });
        return;
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
        return;
    }
};

// Alternative version if your model uses snake_case
export const loginServiceSnakeCase = async (
    phoneNumber: string,
    password: string
): Promise<{ accessToken: string; refreshToken: string; owner: Owner } | null> => {
    if (!phoneNumber || !password) {
        return null;
    }

    const owner = await Owner.findOne({
        where: { phoneNumber, isActive: true },
    });

    if (!owner) return null;

    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) return null;

    // Ensure ownerId is properly typed as string
    const ownerId = String(owner.id);
    if (!ownerId) {
        throw new Error("Owner ID is not defined");
    }

    const payload: JwtPayload = { ownerId };

    const accessToken = jwt.sign(
        payload, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: ACCESS_TOKEN_EXPIRY } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
        payload, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: REFRESH_TOKEN_EXPIRY } as jwt.SignOptions
    );

    return { accessToken, refreshToken, owner };
};