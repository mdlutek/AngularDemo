import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from './services/book.service';
import { Book, BookStatus } from './models/book.model';

type ViewTab = 'all' | 'available' | 'borrowed' | 'add' | 'stats';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  bookService = inject(BookService);

  // Stan nawigacji i wyszukiwania
  activeTab = signal<ViewTab>('all');
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');

  // Formularz nowej książki
  newBook: Book = {
    title: '',
    author: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    category: 'Fantasy',
    status: BookStatus.Available,
  };

  borrowerNames: { [bookId: string]: string } = {};

  ngOnInit() {
    this.bookService.loadBooks().subscribe();
  }

  // Obliczane na żywo: Przefiltrowana lista książek (Signals computed)
  filteredBooks = computed(() => {
    const list = this.bookService.books();
    const query = this.searchQuery().toLowerCase().trim();
    const tab = this.activeTab();
    const cat = this.selectedCategory();

    return list.filter((book) => {
      // Filtr zakładek
      const isAvail = this.isAvailable(book.status);
      if (tab === 'available' && !isAvail) return false;
      if (tab === 'borrowed' && isAvail) return false;

      // Filtr kategorii
      if (cat !== 'all' && book.category !== cat) return false;

      // Filtr wyszukiwarki
      if (!query) return true;
      return (
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query)
      );
    });
  });

  // Obliczane na żywo: Statystyki biblioteki
  stats = computed(() => {
    const list = this.bookService.books();
    const total = list.length;
    const borrowed = list.filter((b) => !this.isAvailable(b.status)).length;
    const available = total - borrowed;
    const borrowRate = total > 0 ? Math.round((borrowed / total) * 100) : 0;

    return { total, available, borrowed, borrowRate };
  });

  // Zmiana aktywnej zakładki
  setTab(tab: ViewTab) {
    this.activeTab.set(tab);
  }

  // Dodawanie książki
  onAddBook() {
    if (!this.newBook.title || !this.newBook.author) {
      alert('Podaj przynajmniej tytuł i autora!');
      return;
    }

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
        this.newBook = {
          title: '',
          author: '',
          isbn: '',
          publishedYear: new Date().getFullYear(),
          category: 'Fantasy',
          status: BookStatus.Available,
        };
        this.activeTab.set('all'); // Przejdź do katalogu po dodaniu
      },
      error: (err) => alert('Błąd: ' + (err.error?.title || err.message)),
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
