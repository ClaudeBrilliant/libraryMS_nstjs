import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './interfaces/books.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  private books: Book[] = [
    {
      id: 1,
      name: 'Clyde',
      author: 'John',
      publishedYear: '2020',
    },
    {
      id: 2,
      name: 'Keith',
      author: 'Bruce',
      publishedYear: '2010',
    },
  ];

  private nextId = 3;

  /**
   * Create a new book
   */
  create(data: CreateBookDto): Book {
    const existingBook = this.books.find((book) => book.name === data.name);

    if (existingBook) {
      throw new ConflictException(
        `Book with name "${data.name}" already exists`,
      );
    }

    const newBook: Book = {
      id: this.nextId++,
      ...data,
    };

    this.books.push(newBook);
    return newBook;
  }

  /**
   * Get all books
   */
  findAll(): Book[] {
    return this.books;
  }

  /**
   * Find book by ID
   */
  findOne(id: number): Book {
    const book = this.books.find((book) => book.id === id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  /**
   * Find book by name
   */
  findByName(name: string): Book {
    const book = this.books.find((book) => book.name === name);
    if (!book) {
      throw new NotFoundException(`Book with name "${name}" not found`);
    }
    return book;
  }

  /**
   * Update book
   */
  update(id: number, data: UpdateBookDto): Book {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    if (data.name) {
      const existingBook = this.books.find(
        (book) => book.name === data.name && book.id !== id,
      );
      if (existingBook) {
        throw new ConflictException(
          `Another book with the name "${data.name}" already exists`,
        );
      }
    }

    const updatedBook: Book = {
      ...this.books[bookIndex],
      ...data,
    };

    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  /**
   * Delete book
   */
  delete(id: number): { message: string } {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    const deletedBook = this.books.splice(bookIndex, 1)[0];

    return {
      message: `Book "${deletedBook.name}" has been deleted`,
    };
  }
}
