import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true, trim: true, minLength: 1 })
  eventId: string;

  // rewarding item's code
  @Prop({ required: true, trim: true, minLength: 1 })
  rewardItemCode: boolean;

  @Prop({ required: true, default: 1 })
  quantity: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

RewardSchema.index({ eventId: 1, rewardItemCode: 1 }, { unique: true });
