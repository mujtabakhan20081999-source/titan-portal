import { createContext } from 'react';

/* Shared auth context so any component (e.g. TopBar) can trigger logout. */
export const AuthContext = createContext({ logout: () => {} });
