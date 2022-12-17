import { ExportedUser, TokenPayload } from '../../interfaces/IAuth';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
    namespace Express {
        export interface Request {
            User?: ExportedUser;
            TokenPayload?: TokenPayload;
        }

        export interface Response {
            Token?: string;
        }
    }
}
