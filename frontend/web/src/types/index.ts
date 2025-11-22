// Tipos baseados no formato REAL do seu backend

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Livro {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Emprestimo {
  id: number;
  bookId: number;
  memberId: number;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'active' | 'returned' | 'overdue';
  renewals: number;
  book?: Livro;
  member?: Member;
}

export interface Stats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  mostBorrowedBooks: Array<{
    bookId: number;
    title: string;
    author: string;
    borrowCount: number;
  }>;
}
