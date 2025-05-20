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
    @InjectModel(Event.name) private postModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateEventDto) {
    return this.postModel.create(dto);
  }

  async findAll(sort: 'asc' | 'desc' = 'asc') {
    return this.postModel.find().sort({ title: sort === 'asc' ? 1 : -1 });
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async disable(id: string) {
    return this.postModel.findByIdAndUpdate(
      id,
      { isEnabled: false },
      { new: true },
    );
  }

  async enable(id: string) {
    return this.postModel.findByIdAndUpdate(
      id,
      { isEnabled: true },
      { new: true },
    );
  }

  async resetConditions(id: string) {
    return this.postModel.findByIdAndUpdate(
      id,
      { conditions: [] },
      { new: true },
    );
  }

  async appendCondition(id: string, dto: EventConditionDto) {
    return this.postModel.findByIdAndUpdate(
      id,
      { $push: { conditions: dto } },
      { new: true },
    );
  }

  async replaceComments(id: string, dto: UpdateEventConditionsDto) {
    return this.postModel.findByIdAndUpdate(
      id,
      { conditions: dto.conditions },
      { new: true },
    );
  }
}
