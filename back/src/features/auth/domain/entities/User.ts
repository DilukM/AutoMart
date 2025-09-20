export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(username: string, passwordHash: string): User {
    const id = crypto.randomUUID();
    const now = new Date();
    return new User(id, username, passwordHash, now, now);
  }

  update(passwordHash?: string): User {
    return new User(
      this.id,
      this.username,
      passwordHash ?? this.passwordHash,
      this.createdAt,
      new Date()
    );
  }

  verifyPassword(password: string): boolean {
    // This will be implemented with bcrypt in the service layer
    return false;
  }
}