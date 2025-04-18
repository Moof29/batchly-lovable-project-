
// This file is no longer needed as we've moved the dev auth logic directly into AuthContext
// It's kept as an empty file for now to avoid breaking imports, but should be refactored later

import { User } from '@/types/auth';

export const useDevAuth = () => {
  console.warn('useDevAuth is deprecated, use useAuth from AuthContext directly');
  
  return {
    user: null,
    setUser: () => {},
    isDevMode: false
  };
};
