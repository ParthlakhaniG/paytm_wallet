import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class AuthTokenSchema {
  @Prop({
    type: String,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  authTokenId: string;

  @Prop({ nullable: true })
  fk_user_id: string;

  @Prop({ type: 'character varying' })
  accessToken: string;

  @Prop({ nullable: true, type: 'character varying' })
  refreshToken: string;

  @Prop({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Prop({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
