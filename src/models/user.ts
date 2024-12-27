// src/models/User.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import { ModelsEnum } from '../constants/enums/models';

export interface IUserDocument extends Document {
  _id: Types.ObjectId | string;
  googleId: string;
  email: string;
  name: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  accessToken: { type: String }
}, { timestamps: true});

const UserModel = mongoose.model<IUserDocument>(ModelsEnum.USER, UserSchema);
export default UserModel;