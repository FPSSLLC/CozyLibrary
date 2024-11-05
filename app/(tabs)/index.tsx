import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, XCircle } from 'lucide-react-native';
import { bookService } from '@/src/firebase/bookService';
import type { Book } from '@/src/firebase/config';
import AddBookForm from '@/src/components/AddBookForm';

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const fetchedBooks = await bookService.getBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (newBook: Omit<Book, 'id'>) => {
    try {
      await bookService.addBook(newBook);
      setShowAddForm(false); // Hide the form after adding
      loadBooks(); // Reload the book list
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const toggleCheckout = async (bookId: string) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (book) {
        await bookService.updateBook(bookId, {
          isCheckedOut: !book.isCheckedOut,
          checkedOutDate: !book.isCheckedOut ? new Date() : null,
          dueDate: !book.isCheckedOut ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
        });
        loadBooks();
      }
    } catch (error) {
      console.error('Error toggling checkout:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">Cozy Library</ThemedText>
        <ThemedText type="subtitle">Your Personal Book Manager</ThemedText>
      </ThemedView>

      {showAddForm ? (
        <AddBookForm
          onSubmit={handleAddBook}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <>
          <ScrollView style={styles.bookList}>
            {books.map(book => (
              <ThemedView key={book.id} style={styles.bookItem}>
                <ThemedView>
                  <ThemedText type="defaultSemiBold">{book.title}</ThemedText>
                  <ThemedText>{book.author}</ThemedText>
                  {book.isCheckedOut && book.dueDate && (
                    <ThemedText style={styles.dueDate}>
                      Due: {new Date(book.dueDate).toLocaleDateString()}
                    </ThemedText>
                  )}
                </ThemedView>
                <Pressable onPress={() => book.id && toggleCheckout(book.id)}>
                  {book.isCheckedOut ?
                    <XCircle color="red" size={24} /> :
                    <CheckCircle color="green" size={24} />
                  }
                </Pressable>
              </ThemedView>
            ))}
          </ScrollView>

          <Pressable style={styles.addButton} onPress={() => setShowAddForm(true)}>
            <PlusCircle color="#2c3e50" size={32} />
            <ThemedText type="defaultSemiBold">Add Book</ThemedText>
          </Pressable>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  bookList: {
    flex: 1,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 16,
  },
});