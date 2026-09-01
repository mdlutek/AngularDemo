export enum BookStatus {
  Available = "Available",
  Borrowed = "Borrowed",
  Maintenance = "Maintenance",
}

export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  category: string;
  status: BookStatus | number;
  borrowedBy?: string | null;
  borrowedAt?: string | null;
  createdAt?: string;
}

export interface BorrowRequest {
  borrowerName: string;
}
