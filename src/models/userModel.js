import db from '../../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  static tableName = 'users'; // Table name
  static saltRounds = 10; // For hashing passwords

  static async createUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, User.saltRounds);
    const [user] = await db(User.tableName).insert({ name, email, password: hashedPassword }).returning('*');
    return user;
  };

  static async getUserByEmail(email) {
    const [user] = await db(User.tableName).where({ email }).select('*');
    return user || false;
  };

  static async updateUser(email, modifiedUser) {
    const { password } = modifiedUser;
    if (password) {
      modifiedUser.password = await bcrypt.hash(password, User.saltRounds);
    }
    const [updatedUser] = await db(User.tableName).where({ email }).update(modifiedUser).returning('*');
    return updatedUser || false;
  }

  static async deleteUser(email) {
    const resp = await db(User.tableName).where({ email }).del();
    return resp;
  }

  static async verifyUserCredentials(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  static async markUserEmailVerified(email) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      console.log(`Could not mark user email ${email} as verified`);
      return false;
    }
    await db(User.tableName).where({ id: user.id }).update({ is_email_verified: true });
    return true;
  }

};

export default User;