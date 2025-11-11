import { User } from '@/types/auth';

const USERS_KEY = 'bookmylpg_users';
const CURRENT_USER_KEY = 'bookmylpg_current_user';

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const register = (email: string, password: string, name: string, phone: string, address: string): { success: boolean; error?: string; user?: User } => {
  const users = getUsers();
  
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name,
    phone,
    address,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  
  // Also store password separately (in real app, this would be hashed)
  const passwords = JSON.parse(localStorage.getItem('bookmylpg_passwords') || '{}');
  passwords[email] = password;
  localStorage.setItem('bookmylpg_passwords', JSON.stringify(passwords));

  return { success: true, user: newUser };
};

export const login = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const passwords = JSON.parse(localStorage.getItem('bookmylpg_passwords') || '{}');
  if (passwords[email] !== password) {
    return { success: false, error: 'Incorrect password' };
  }

  setCurrentUser(user);
  return { success: true, user };
};

export const logout = () => {
  setCurrentUser(null);
};

export const updateUserAddress = (userId: string, address: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return false;
  
  users[userIndex].address = address;
  saveUsers(users);
  
  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    setCurrentUser(users[userIndex]);
  }
  
  return true;
};
