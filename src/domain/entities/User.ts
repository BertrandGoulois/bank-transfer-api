import bcrypt from 'bcrypt';

export class User {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly email: string,
        private _password: string
    ) { }

    get password(): string {
        return this._password;
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this._password);
    }

    async changePassword(newPassword: string) {
        if (!this.isValidPassword(newPassword)) throw new Error('Invalid password');
        this._password = await bcrypt.hash(newPassword, 10);
    }

    private isValidPassword(password: string): boolean {
        // example rule: at least 8 chars, one number
        return /^(?=.*\d).{8,}$/.test(password);
    }
}
