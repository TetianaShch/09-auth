export type User = {
    id: string;
    email: string;
    username?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type AuthCredentials = {
    email: string;
    password: string;
};
