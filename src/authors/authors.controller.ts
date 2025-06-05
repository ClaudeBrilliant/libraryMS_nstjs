import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './interfaces/author.interface';
import { ApiResponse } from 'src/shared/interfaces/api-response.interface';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  /**
   * Create a new author
   * POST /authors
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateAuthorDto): ApiResponse<Author> {
    try {
      const author = this.authorsService.create(data);
      return {
        success: true,
        message: 'Author created successfully',
        data: author,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create author',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all authors
   * GET /authors
   */
  @Get()
  findAll(): ApiResponse<Author[]> {
    const authors = this.authorsService.findAll();
    return {
      success: true,
      message: 'Authors retrieved successfully',
      data: authors,
    };
  }

  /**
   * Get one author by ID
   * GET /authors/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ApiResponse<Author> {
    try {
      const author = this.authorsService.findOne(id);
      return {
        success: true,
        message: 'Author retrieved successfully',
        data: author,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve author',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update an author
   * PATCH /authors/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAuthorDto,
  ): ApiResponse<Author> {
    try {
      const updated = this.authorsService.update(id, data);
      return {
        success: true,
        message: 'Author updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update author',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Delete an author
   * DELETE /authors/:id
   */
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ): ApiResponse<{ message: string }> {
    try {
      const result = this.authorsService.delete(id);
      return {
        success: true,
        message: result.message,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete author',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
