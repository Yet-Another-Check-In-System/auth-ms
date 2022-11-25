export interface GroupWithoutUsers {
    id: string;
    name: string;
}

export interface SingleGroup {
    id: string;
    name: string;
    users: string[];
}
