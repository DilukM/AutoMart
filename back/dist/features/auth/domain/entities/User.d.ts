export declare class User {
    readonly id: string;
    readonly username: string;
    readonly passwordHash: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, username: string, passwordHash: string, createdAt: Date, updatedAt: Date);
    static create(username: string, passwordHash: string): User;
    update(passwordHash?: string): User;
    verifyPassword(password: string): boolean;
}
//# sourceMappingURL=User.d.ts.map