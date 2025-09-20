"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../config/database");
const UserEntity_1 = require("../auth/infrastructure/database/entities/UserEntity");
dotenv_1.default.config();
const seedAdmin = async () => {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connected for seeding');
        const userRepository = database_1.AppDataSource.getRepository(UserEntity_1.UserEntity);
        const existingAdmin = await userRepository.findOne({
            where: { username: process.env.ADMIN_USERNAME || 'admin' }
        });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const passwordHash = await bcrypt_1.default.hash(adminPassword, 12);
        const adminUser = userRepository.create({
            username: process.env.ADMIN_USERNAME || 'admin',
            passwordHash
        });
        await userRepository.save(adminUser);
        console.log('Admin user created successfully');
        console.log(`Username: ${adminUser.username}`);
        console.log(`Password: ${adminPassword}`);
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
    }
};
exports.seedAdmin = seedAdmin;
if (require.main === module) {
    seedAdmin();
}
//# sourceMappingURL=seedAdmin.js.map