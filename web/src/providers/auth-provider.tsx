import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionData } from '../interfaces/auth.interface';
import { IUser, OfficeBranch, UserType } from '../interfaces/user.interface';

const AuthContext = createContext<{
  session: SessionData,
  login: (token: string, user: IUser) => void,
  branch: string | null,
  logout: () => void,
  loading: boolean | null,
  setBranch: (branch: string) => void,
  getBranch: () => string | null,

}>({
  session: { token: null, user: null },
  branch: null,
  login: () => { },
  logout: () => { },
  loading: null,
  setBranch: () => { },
  getBranch: () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionData>({
    token: null,
    user: null
  });
  const [branch, setBranch] = useState<string | null>(localStorage.getItem('branch'));

  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    const storedUser = localStorage.getItem('sessionUser');
    setSession({
      token: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null
    })
    if (session.user?.userType === UserType.EMPLOYEE) {
      setBranch(session.user.officeBranch as OfficeBranch)
    }
    setLoading(false)
  }, []);

  const updateBranch = (newBranch: string) => {
    localStorage.setItem('branch', newBranch);
    setBranch(newBranch);
  };

  const login = (token: string, user: IUser) => {
    localStorage.setItem('sessionToken', token);
    localStorage.setItem('sessionUser', JSON.stringify(user));
    setSession({ token, user });
  }

  const logout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionUser');
    setSession({ token: null, user: null });
  }

  return (
    <AuthContext.Provider value={{ session, branch, login, logout, setBranch: updateBranch, getBranch: () => branch, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
