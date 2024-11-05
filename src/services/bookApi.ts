const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function fetchBookByISBN(isbn: string) {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=isbn:${isbn}`
    );
    const data = await response.json();

    if (data.items && data.items[0]) {
      const book = data.items[0].volumeInfo;
      return {
        title: book.title,
        author: book.authors ? book.authors.join(', ') : 'Unknown Author',
        isbn: isbn,
        description: book.description || '',
        coverImage: book.imageLinks?.thumbnail || '',
      };
    }
    throw new Error('Book not found');
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
}