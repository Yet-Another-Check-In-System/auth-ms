import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DateTime } from 'luxon';

import { ExportedUser, SignupLocalUser } from '../interfaces/IAuthService';
import logger from '../utils/logger';

export const verifyLocalLogin = async (
    email: string,
    password: string,
    prisma: PrismaClient
): Promise<ExportedUser | null> => {
    logger.debug('Verifying login information');

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    // User not found or user doesn't have a password
    if (!user || !user.password) {
        logger.warn('Incorrect email or password.');
        return null;
    }

    // Compare passwords
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        logger.warn('Incorrect email or password.');
        return null;
    }

    // Update user expiry
    const expiryDate = DateTime.utc().plus({ years: 1 });

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            expireAt: expiryDate.toJSDate()
        }
    });

    const exportedUser: ExportedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        company: user.company
    };

    return exportedUser;
};

export const signupLocal = async (
    signUpData: SignupLocalUser,
    prisma: PrismaClient
): Promise<ExportedUser | null> => {
    const user = await prisma.user.findFirst({
        select: {
            id: true,
            email: true
        },
        where: {
            email: signUpData.email
        }
    });

    // Check if user already exists with the email
    if (user) {
        logger.warn(
            `Email "${signUpData.email}" is already associated with an account.`
        );
        return null;
    }

    const expiryDate = DateTime.utc().plus({ years: 1 });
    const userData = {
        ...signUpData,
        password: await bcrypt.hash(signUpData.password, 10),
        expireAt: expiryDate.toJSDate()
    };

    logger.debug(`Sign up with data: ${JSON.stringify(userData)}`);

    // Insert new user to database
    const createdUser = await prisma.user.create({
        data: userData
    });

    const exportedUser: ExportedUser = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        country: createdUser.country,
        company: createdUser.company
    };

    return exportedUser;
};
