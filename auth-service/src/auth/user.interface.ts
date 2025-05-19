import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  readonly password: number;
  readonly role: number;
  readonly isActive: boolean;
}
