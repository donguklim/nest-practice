import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '@app/event/db/event.schema';
import { Model } from 'mongoose';
import { CreateEventDto } from '@app/event/dto/create-event.dto';
import { UpdateEventConditionsDto } from '@app/event/dto/update-conditions.dto';
import { EventConditionDto } from '@app/event/dto/condition.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateEventDto) {
    return this.eventModel.create(dto);
  }

  async findAllWithCursor(options: {
    cursor?: string;
    size?: number;
    sort?: 'asc' | 'desc';
    sortBy?: 'title' | 'startDate' | 'endDate';
  }) {
    const { cursor, size = 10, sort = 'asc', sortBy = 'title' } = options;

    const direction = sort === 'asc' ? 1 : -1;

    // Cursor filter
    const filter = cursor
      ? {
          [sortBy]: {
            [sort === 'asc' ? '$gt' : '$lt']:
              sortBy === 'startDate' || sortBy === 'endDate'
                ? new Date(cursor)
                : cursor,
          },
        }
      : {};

    const docs = await this.eventModel
      .find(filter)
      .sort({ [sortBy]: direction })
      .limit(size + 1);

    const hasNext = docs.length > size;
    const items = hasNext ? docs.slice(0, size) : docs;
    const nextCursor = hasNext ? items[items.length - 1][sortBy] : null;

    return {
      items,
      nextCursor,
      hasNext,
    };
  }

  async findOne(id: string) {
    const post = await this.eventModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async disable(id: string) {
    return this.eventModel.findByIdAndUpdate(
      id,
      { isEnabled: false },
      { new: true },
    );
  }

  async enable(id: string) {
    return this.eventModel.findByIdAndUpdate(
      id,
      { isEnabled: true },
      { new: true },
    );
  }

  async resetConditions(id: string) {
    return this.eventModel.findByIdAndUpdate(
      id,
      { conditions: [] },
      { new: true },
    );
  }

  async appendCondition(id: string, dto: EventConditionDto) {
    return this.eventModel.findByIdAndUpdate(
      id,
      { $push: { conditions: dto } },
      { new: true },
    );
  }

  async replaceComments(id: string, dto: UpdateEventConditionsDto) {
    return this.eventModel.findByIdAndUpdate(
      id,
      { conditions: dto.conditions },
      { new: true },
    );
  }
}
