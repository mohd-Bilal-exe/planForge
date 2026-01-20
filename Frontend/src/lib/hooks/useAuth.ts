import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { firebaseService, UserData } from '../firebase/firebaseService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const data = await firebaseService.getUserDocument(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    
    try {
      await firebaseService.updateUserDocument(user.uid, data);
      const updatedData = await firebaseService.getUserDocument(user.uid);
      setUserData(updatedData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  return {
    user,
    userData,
    loading,
    updateUserData,
    isAuthenticated: !!user
  };
};