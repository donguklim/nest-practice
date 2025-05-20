import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventTypeEnum } from '@app/event/event.type.enum';

@Schema({ _id: false })
export class EventCondition {
  // type of condition. Eg, friend request, quest cleared, login event
  @Prop({ required: true, enum: Object.values(EventTypeEnum) })
  eventType: string;

  // code that specifies target of the event type.
  // Eg, monster name if event type is monster kill,
  // quest code if event type is quest
  @Prop()
  targetCode: string;

  @Prop({ required: true, default: 1 })
  quantity: number;

  // the date range fields
  @Prop({
    type: Date,
    default: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1000);
      return date;
    },
  })
  fromDate: Date;

  @Prop({
    type: Date,
    default: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1000);
      return date;
    },
  })
  toDate: Date;
}

export const EventConditionSchema =
  SchemaFactory.createForClass(EventCondition);
