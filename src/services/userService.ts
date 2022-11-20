import bcrypt from 'bcryptjs';
import prisma from '../utils/prismaHandler';
import logger from '../utils/logger';
import { ExportedUser, SignupLocalUser } from '../interfaces/IUserService';

export const verifyLocalLogin = async (
    email: string,
    password: string
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
        fullname: user.fullname,
        email: user.email
    };

    return exportedUser;
};

export const signupLocal = async (
    data: SignupLocalUser
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
    const exportedUser: ExportedUser = await prisma.user.create({
        data: {
            ...data,
            fullname: `${data.firstName} ${data.lastName}`,
            password: await bcrypt.hash(data.password, 10)
        }
    });

    return exportedUser;
};
