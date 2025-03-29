import { useContext } from 'react'
import { UserContext } from '@/contexts/userContext.js'
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
