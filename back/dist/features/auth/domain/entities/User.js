"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, username, passwordHash, createdAt, updatedAt) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(username, passwordHash) {
        const id = crypto.randomUUID();
        const now = new Date();
        return new User(id, username, passwordHash, now, now);
    }
    update(passwordHash) {
        return new User(this.id, this.username, passwordHash ?? this.passwordHash, this.createdAt, new Date());
    }
    verifyPassword(password) {
        return false;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map