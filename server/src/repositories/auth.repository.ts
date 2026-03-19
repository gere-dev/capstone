import { User } from '../models/index.js';

import { userSchema, type TUser, type TUserBase } from '../schema/user.schema.js';

export class AuthRepository {
	private model = User;

	protected format(record: User): TUser {
		return {
			id: record.id,
			name: record.name,
			email: record.email,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	public async register(userData: TUserBase): Promise<TUser> {
		const user = await this.model.create(userData);
		const formattedRecord = this.format(user);
		return userSchema.parse(formattedRecord);
	}

	public async findUserByEmail(email: string): Promise<User | null> {
		return await this.model.findOne({ where: { email } });
	}

	public async findById(id: string): Promise<TUser | null> {
		const user = await this.model.findByPk(id);
		if (!user) return null;
		const formattedRecord = this.format(user);
		return userSchema.parse(formattedRecord);
	}
}

export const authRepository = new AuthRepository();
