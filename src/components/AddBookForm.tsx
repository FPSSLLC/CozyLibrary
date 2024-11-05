import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { Book } from '@/src/firebase/config';

type AddBookFormProps = {
  onSubmit: (book: Omit<Book, 'id'>) => Promise<void>;
  onCancel: () => void;
};

export default function AddBookForm({ onSubmit, onCancel }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');

  const handleSubmit = () => {
    if (!title || !author) return;

    onSubmit({
      title,
      author,
      isbn,
      isCheckedOut: false,
      nfcTag: '', // We'll add NFC scanning later
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add New Book</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Book Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Author"
          value={author}
          onChangeText={setAuthor}
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="ISBN (optional)"
          value={isbn}
          onChangeText={setIsbn}
          placeholderTextColor="#666"
          keyboardType="numeric"
        />
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <ThemedText>Cancel</ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            styles.submitButton,
            (!title || !author) && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!title || !author}
        >
          <ThemedText style={styles.submitButtonText}>
            Add Book
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    gap: 20,
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#2c3e50',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});