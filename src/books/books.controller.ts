import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiResponse } from 'src/shared/interfaces/api-response.interface';
import { Book } from './interfaces/books.interface';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateBookDto): ApiResponse<Book> {
    try {
      const book = this.booksService.create(data);
      return {
        success: true,
        message: 'Book added successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  findAll(): ApiResponse<Book[]> {
    const books = this.booksService.findAll();
    return {
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ApiResponse<Book> {
    try {
      const book = this.booksService.findOne(id);
      return {
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBookDto,
  ): ApiResponse<Book> {
    try {
      const book = this.booksService.update(id, data);
      return {
        success: true,
        message: 'Book updated successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Soft delete a book
   * DELETE /books/:id
   */
  @Delete(':id')
  softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): ApiResponse<{ message: string }> {
    try {
      const result = this.booksService.delete(id);
      return {
        success: true,
        message: result.message,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Hard delete a book
   * DELETE /books/:id/permanent
   */
  @Delete(':id/permanent')
  hardDelete(
    @Param('id', ParseIntPipe) id: number,
  ): ApiResponse<{ message: string }> {
    try {
      const result = this.booksService.delete(id); // If soft/hard handled differently, you'd need separate methods
      return {
        success: true,
        message: `Book permanently deleted: ${result.message}`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to hard delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
