// src/members/members.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Member } from './interfaces/members.interface';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  private members: Member[] = [];
  private nextId = 1;

  create(data: CreateMemberDto): Member {
    const existing = this.members.find((m) => m.email === data.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const newMember: Member = {
      id: this.nextId++,
      ...data,
    };

    this.members.push(newMember);
    return newMember;
  }

  findAll(): Member[] {
    return this.members;
  }

  findOne(id: number): Member {
    const member = this.members.find((m) => m.id === id);
    if (!member) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }
    return member;
  }

  update(id: number, data: UpdateMemberDto): Member {
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }

    const updated: Member = {
      ...this.members[index],
      ...data,
    };

    this.members[index] = updated;
    return updated;
  }

  delete(id: number): { message: string } {
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }

    const removed = this.members.splice(index, 1)[0];
    return { message: `Member "${removed.name}" deleted` };
  }
}
