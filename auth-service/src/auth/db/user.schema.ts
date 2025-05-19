import * as mongoose from 'mongoose';
import { UserRole } from '@app/auth/constants';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, enum: Object.values(UserRole) },
});

UserSchema.index({ username: 'hashed' });
