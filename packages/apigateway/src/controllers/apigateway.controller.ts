import {
  get,
  post,
  patch,
  del,
  requestBody,
  param,
} from '@loopback/rest';
import axios from 'axios';
import {BookInterface} from '../interfaces/book-interface';
//import config from '../config';

//const {
//   DEVELOPMENT: {BOOK_BASE_URL, AUTHOR_BASE_URL, CATEGORY_BASE_URL},
// } = config;

export class ApiGatewayController {
  private bookServiceUrl = 'http://127.0.0.1:3001/books';
  private authorServiceUrl = 'http://127.0.0.1:3002/authors';
  private categoryServiceUrl = 'http://127.0.0.1:3003/categories';

  constructor() {}

  // Books endpoints
  @post('/books')
  async createBook(@requestBody() book: BookInterface) {
    const response = await axios.post(`${this.bookServiceUrl}`, book);
    return response.data;
  }

  @get('/books')
  async getBooks() {
    try {
      const booksResponse = await axios.get(`${this.bookServiceUrl}`);
      const books = booksResponse.data;
      const booksWithDetails = await Promise.all(
        books.map(async (book: any) => {
          try {
            const author = await this.fetchAuthor(book.bookAuthorId);
            const category = await this.fetchCategory(book.bookCategoryId);
            return {
              bookId: book.bookId,
              bookTitle: book.bookTitle,
              bookIsbn: book.bookIsbn,
              bookPrice: book.bookPrice,
              bookPublishDate: book.bookPublishDate,
              author: author.bookAuthorName,
              category: category.bookCategoryName,
            };
          } catch (error) {
            console.error('Failed to fetch author or category:', error.message);
            return book;
          }
        }),
      );
      return booksWithDetails;
    } catch (error) {
      return {error: 'Failed to fetch books', details: error.message};
    }
  }

  @get('/books/{id}')
  async getBookById(@param.path.string('id') id: string) {
    const response = await axios.get(`${this.bookServiceUrl}/${id}`);
    return response.data;
  }

  @patch('/books/{id}')
  async updateBookById(
    @param.path.string('id') id: string,
    @requestBody() book: any,
  ) {
    const response = await axios.patch(
      `${this.bookServiceUrl}/${id}`,
      book,
    );
    return response.data;
  }

  @del('/books/{id}')
  async deleteBookById(@param.path.string('id') id: string) {
    const response = await axios.delete(`${this.bookServiceUrl}/${id}`);
    return response.data;
  }

  private async fetchAuthor(bookAuthorId: string) {
    try {
      const response = await axios.get(
        `${this.authorServiceUrl}/${bookAuthorId}`,
      );
      return response.data;
    } catch (error) {
      return {error: `Author not found for id ${bookAuthorId}`};
    }
  }

  private async fetchCategory(bookCategoryId: string) {
    try {
      const response = await axios.get(
        `${this.categoryServiceUrl}/${bookCategoryId}`,
      );
      return response.data;
    } catch (error) {
      return {error: `Category not found for id ${bookCategoryId}`};
    }
  }

  // Authors endpoints
  @post('/authors')
  async createAuthor(@requestBody() author: any) {
    const response = await axios.post(
      `${this.authorServiceUrl}`,
      author,
    );
    return response.data;
  }

  @get('/authors')
  async getAllAuthors() {
    const response = await axios.get(`${this.authorServiceUrl}`);
    return response.data;
  }

  @get('/authors/{id}')
  async getAuthorById(@param.path.string('id') id: string) {
    const response = await axios.get(`${this.authorServiceUrl}/${id}`);
    return response.data;
  }

  @patch('/authors/{id}')
  async updateAuthor(
    @param.path.string('id') id: string,
    @requestBody() author: any,
  ) {
    const response = await axios.patch(
      `${this.authorServiceUrl}/${id}`,
      author,
    );
    return response.data;
  }

  @del('/authors/{id}')
  async deleteAuthor(@param.path.string('id') id: string) {
    const response = await axios.delete(
      `${this.authorServiceUrl}/${id}`,
    );
    return response.data;
  }

  // Categories endpoints
  @post('/categories')
  async createCategory(@requestBody() category: any) {
    const response = await axios.post(
      `${this.categoryServiceUrl}`,
      category,
    );
    return response.data;
  }

  @get('/categories')
  async getAllCategories() {
    const response = await axios.get(`${this.categoryServiceUrl}`);
    return response.data;
  }

  @get('/categories/{id}')
  async getCategoryById(@param.path.string('id') id: string) {
    const response = await axios.get(
      `${this.categoryServiceUrl}/${id}`,
    );
    return response.data;
  }

  @patch('/categories/{id}')
  async updateCategory(
    @param.path.string('id') id: string,
    @requestBody() category: any,
  ) {
    const response = await axios.patch(
      `${this.categoryServiceUrl}/${id}`,
      category,
    );
    return response.data;
  }

  @del('/categories/{id}')
  async deleteCategory(@param.path.string('id') id: string) {
    const response = await axios.delete(
      `${this.categoryServiceUrl}/${id}`,
    );
    return response.data;
  }
}
