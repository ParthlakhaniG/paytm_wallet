import { v4 as uuid } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: String,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  userId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ nullable: true, type: 'character varying' })
  image: string;

  @Prop({ type: 'character varying' })
  mobileNumber: string;

  @Prop({ nullable: true, type: 'integer' })
  otp: number;

  @Prop({ default: 1, comment: `1 : User not deleted, 0 : User deleted` })
  isArchived: number;

  @Prop({
    default: 1,
    comment: `1 : item available, 0 : item is not available`,
  })
  isActive: number;

  @Prop({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Prop({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

export const AudioSchema = SchemaFactory.createForClass(User);
