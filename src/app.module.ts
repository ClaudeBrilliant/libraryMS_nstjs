import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './authors/authors.module';
import { MembersModule } from './members/members.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [AuthorsModule, MembersModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
