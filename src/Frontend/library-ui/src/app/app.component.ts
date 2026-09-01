import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from './services/book.service';
import { Book, BookStatus } from './models/book.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  bookService = inject(BookService);

  newBook: Book = {
    title: '',
    author: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    category: 'Inne',
    status: BookStatus.Available,
  };

  borrowerNames: { [bookId: string]: string } = {};

  ngOnInit() {
    this.bookService.loadBooks().subscribe();
  }

  onAddBook() {
    if (!this.newBook.title || !this.newBook.author) {
      alert('Podaj przynajmniej tytuł i autora!');
      return;
    }

    // Tworzymy czysty obiekt do wysłania (bez pola id)
    const bookToSend: Book = {
      title: this.newBook.title,
      author: this.newBook.author,
      isbn: this.newBook.isbn,
      publishedYear: Number(this.newBook.publishedYear),
      category: this.newBook.category,
      status: BookStatus.Available,
    };

    this.bookService.addBook(bookToSend).subscribe({
      next: () => {
        // Reset formularza
        this.newBook = {
          title: '',
          author: '',
          isbn: '',
          publishedYear: new Date().getFullYear(),
          category: 'Fantasy',
          status: BookStatus.Available,
        };
      },
      error: (err) => {
        console.error(err);
        alert('Błąd podczas dodawania: ' + (err.error?.title || err.message));
      },
    });
  }
  onDeleteBook(id?: string) {
    if (!id) return;
    if (confirm('Czy na pewno chcesz usunąć tę książkę?')) {
      this.bookService.deleteBook(id).subscribe();
    }
  }

  onBorrow(id?: string) {
    if (!id) return;
    const borrower = this.borrowerNames[id];
    if (!borrower || borrower.trim() === '') {
      alert('Wpisz imię i nazwisko czytelnika!');
      return;
    }

    this.bookService.borrowBook(id, borrower).subscribe({
      next: () => {
        this.borrowerNames[id] = '';
      },
      error: (err) => alert('Błąd wypożyczenia: ' + (err.error?.message || err.message)),
    });
  }

  onReturn(id?: string) {
    if (!id) return;
    this.bookService.returnBook(id).subscribe({
      error: (err) => alert('Błąd zwrotu: ' + (err.error?.message || err.message)),
    });
  }

  isAvailable(status: any): boolean {
    return status === 0 || status === 'Available';
  }
}
