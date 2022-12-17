export interface ExportedUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    company: string | null;
}

export interface TokenPayload {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    company: string | null;
    exp: number;
    iat: number;
    aud: string[];
    iss: string;
    sub: string;
}

export interface SignupLocalUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    company: string | null;
}
