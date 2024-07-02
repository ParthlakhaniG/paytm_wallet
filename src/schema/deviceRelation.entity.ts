import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class DeviceRelationSchema {
  @Prop({
    type: String,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  deviceRelationId: string;

  @Prop()
  fk_user_id: string;

  @Prop({ type: 'int' })
  deviceType: number;

  @Prop({ type: 'character varying' })
  deviceId: string;

  @Prop({ type: 'character varying' })
  deviceToken: string;

  @Prop({ type: 'character varying' })
  appVersion: string;

  @Prop({ type: 'character varying' })
  os: string;

  @Prop({ type: 'character varying', comment: `en for English` })
  language: string;

  @Prop({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Prop({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
