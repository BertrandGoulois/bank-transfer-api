import { UserRepository } from '../../../domain/repositories';
import { User } from '../../../domain/entities';
import { UserModel } from '../models/UserModel';

export class SequelizeUserRepository implements UserRepository {
    async findById(id: number): Promise<User | null> {
        const record = await UserModel.findByPk(id);
        if (!record) return null;
        return this.toDomain(record);
    }

    async findByEmail(email: string): Promise<User | null> {
        const record = await UserModel.findOne({ where: { email } });
        if (!record) return null;
        return this.toDomain(record);
    }

    async save(user: User): Promise<void> {
        await UserModel.update(
            { name: user.name, email: user.email, password: user.password },
            { where: { id: user.id } }
        );
    }

    async create(user: User): Promise<User> {
        const record = await UserModel.create({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
        });
        return this.toDomain(record);
    }

    async findAll(): Promise<User[]> {
        const records = await UserModel.findAll();
        return records.map(r => this.toDomain(r));
    }

    private toDomain(record: UserModel): User {
        return new User(
            record.id,
            record.name,
            record.email,
            record.password
        );
    }
}
