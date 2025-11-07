import { UserModel } from '../models/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginService = async (email: string, password: string): Promise<string> => {
  const user = await UserModel.findOne({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid credentials' };

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  return token;
}

export default loginService;
