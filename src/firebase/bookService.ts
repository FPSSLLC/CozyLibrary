import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import type { Book } from './config';

export const bookService = {
  // Get all books
  async getBooks() {
    const booksQuery = query(collection(db, 'books'));
    const snapshot = await getDocs(booksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Book));
  },

  // Add a new book
  async addBook(book: Omit<Book, 'id'>) {
    return addDoc(collection(db, 'books'), book);
  },

  // Update a book
  async updateBook(id: string, updates: Partial<Book>) {
    const bookRef = doc(db, 'books', id);
    return updateDoc(bookRef, updates);
  },

  // Delete a book
  async deleteBook(id: string) {
    const bookRef = doc(db, 'books', id);
    return deleteDoc(bookRef);
  }
};