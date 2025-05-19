import * as mongoose from 'mongoose';
import { Role } from '@app/auth/role.enum';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: Number,
    enum: Object.values(Role).filter((v) => typeof v === 'number'),
  },
  isActive: { type: Boolean, default: true },
});

UserSchema.index({ username: 'hashed' });
