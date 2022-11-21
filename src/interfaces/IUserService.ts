export interface ExportedUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    company: string | null;
}

export interface SignupLocalUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    company: string | null;
}
