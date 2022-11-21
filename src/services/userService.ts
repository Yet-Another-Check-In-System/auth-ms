import bcrypt from 'bcryptjs';
import logger from '../utils/logger';
import { ExportedUser, SignupLocalUser } from '../interfaces/IUserService';
import { PrismaClient } from '@prisma/client';

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

    const exportedUser: ExportedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };

    return exportedUser;
};

export const signupLocal = async (
    data: SignupLocalUser,
    prisma: PrismaClient
): Promise<ExportedUser | null> => {
    const user = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    });

    // Check if user already exists with the email
    if (user) {
        logger.warn(
            `Email "${data.email}" is already associated with an account.`
        );
        return null;
    }

    // Insert new user to database
    const createdUser = await prisma.user.create({
        data: {
            ...data,
            password: await bcrypt.hash(data.password, 10)
        }
    });

    const exportedUser: ExportedUser = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email
    };

    return exportedUser;
};
