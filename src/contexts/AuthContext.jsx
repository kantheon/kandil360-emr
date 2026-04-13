import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

const TEST_USER = {
  uid: 'test-user-001',
  displayName: 'Test Nurse',
  email: 'test@kandil360.com',
  photoURL: null,
};

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginAsTest = () => { setUser(TEST_USER); };
  const logout = () => {
    if (user?.uid === TEST_USER.uid) {
      setUser(null);
    } else {
      signOut(auth);
    }
  };

  const value = { user, loading, loginWithGoogle, loginAsTest, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
