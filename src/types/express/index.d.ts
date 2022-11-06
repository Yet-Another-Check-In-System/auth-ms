import { ExportedUser } from '../../interfaces/IUserService';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
    namespace Express {
        export interface Request {
            User?: ExportedUser;
        }

        export interface Response {
            Token?: string;
        }
    }
}
