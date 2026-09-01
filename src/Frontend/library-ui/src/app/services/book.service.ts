import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Book, BorrowRequest } from "../models/book.model";

@Injectable({
  providedIn: "root",
})
export class BookService {
  private http = inject(HttpClient);

  // Twój działający adres API na Azure
  private apiUrl =
    "https://library-api-epbef9h6c8bvdugu.polandcentral-01.azurewebsites.net/api/books";

  // Używamy nowoczesnych Angular Signals do przechowywania stanu książek
  books = signal<Book[]>([]);
  isLoading = signal<boolean>(false);

  // Pobierz wszystkie książki
  loadBooks(): Observable<Book[]> {
    this.isLoading.set(true);
    return this.http.get<Book[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.books.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      }),
    );
  }

  // Dodaj nową książkę (Create)
  addBook(book: Book): Observable<Book> {
    return this.http
      .post<Book>(this.apiUrl, book)
      .pipe(tap(() => this.loadBooks().subscribe()));
  }

  // Usuń książkę (Delete)
  deleteBook(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.loadBooks().subscribe()));
  }

  // Wypożycz książkę (Borrow)
  borrowBook(id: string, borrowerName: string): Observable<any> {
    const request: BorrowRequest = { borrowerName };
    return this.http
      .post(`${this.apiUrl}/${id}/borrow`, request)
      .pipe(tap(() => this.loadBooks().subscribe()));
  }

  // Zwróć książkę (Return)
  returnBook(id: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${id}/return`, {})
      .pipe(tap(() => this.loadBooks().subscribe()));
  }
}
