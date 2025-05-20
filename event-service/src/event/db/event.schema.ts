import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventCondition } from '@app/event/db/event.type-schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true, trim: true, minLength: 1, unique: true })
  title: string;

  // event is disabled by default,
  // enabled events cannot be modified as soon as its start date has come
  @Prop({ required: true, default: false })
  isEnabled: boolean;

  @Prop({ required: true, default: new Date() })
  startDate: Date;

  @Prop({
    required: true,
    default: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1000);
      return date;
    },
  })
  endDate: Date;

  @Prop({ type: [EventCondition], default: [] })
  conditions: EventCondition[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ eventName: 'hashed' });
EventSchema.index({ endDate: 1, startDate: 1 });
EventSchema.index({ startDate: 1, endDate: 1 });
