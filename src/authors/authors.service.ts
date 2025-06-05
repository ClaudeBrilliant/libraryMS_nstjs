import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Author } from './interfaces/author.interface';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  private authors: Author[] = [
    {
      id: 1,
      name: 'Clyde',
      age: 30,
      country: 'Kenya',
    },
    {
      id: 2,
      name: 'Keith',
      age: 66,
      country: 'Ghana',
    },
  ];

  private nextId = 3;

  create(data: CreateAuthorDto): Author {
    const existingAuthor = this.authors.find(
      (author) => author.name === data.name,
    );

    if (existingAuthor) {
      throw new ConflictException(
        `Author with name "${data.name}" already exists`,
      );
    }

    const newAuthor: Author = {
      id: this.nextId++,
      ...data,
    };

    this.authors.push(newAuthor);
    return newAuthor;
  }

  findAll(): Author[] {
    return this.authors;
  }

  findOne(id: number): Author {
    const author = this.authors.find((author) => author.id === id);
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    return author;
  }

  update(id: number, data: UpdateAuthorDto): Author {
    const index = this.authors.findIndex((author) => author.id === id);
    if (index === -1) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    if (data.name) {
      const existing = this.authors.find(
        (a) => a.name === data.name && a.id !== id,
      );
      if (existing) {
        throw new ConflictException(
          `Another author with the name "${data.name}" already exists`,
        );
      }
    }

    const updatedAuthor: Author = {
      ...this.authors[index],
      ...data,
    };

    this.authors[index] = updatedAuthor;
    return updatedAuthor;
  }

  delete(id: number): { message: string } {
    const index = this.authors.findIndex((author) => author.id === id);
    if (index === -1) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    const deleted = this.authors.splice(index, 1)[0];
    return {
      message: `Author "${deleted.name}" has been deleted`,
    };
  }
}
