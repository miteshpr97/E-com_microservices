// src/app/provider.tsx
'use client'; // Mark this as a Client Component

import { Provider } from 'react-redux';
import store from '../store'; // Adjust the import path to match your store file
import { UserProvider } from "../context/UserContext";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <UserProvider
      > {children}
      </UserProvider>
    </Provider>
  );
};

export default ReduxProvider;
