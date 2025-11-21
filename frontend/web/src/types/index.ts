export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  category: string;
  available: boolean;
  location?: string;
  description?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: number;
  bookId: number;
  memberId: number;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  createdAt: string;
  updatedAt: string;
  book?: Book;
  member?: Member;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Stats {
  total: number;
  active: number;
  overdue: number;
  returned: number;
  mostBorrowedBooks: Array<{
    bookId: number;
    loanCount: number;
    book: Book;
  }>;
}
