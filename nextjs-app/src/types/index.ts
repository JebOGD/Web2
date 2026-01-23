export interface User {
  id: number;
  email: string;
  username: string;
  phone: string | null;
  location: string | null;
  role: string;
  created_at: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminEditUserProps {
  userId: number;
  username: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
}
