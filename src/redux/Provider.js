'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import QueryProvider from '@/providers/QueryProvider';
export default function ReduxProvider({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </PersistGate>
        </Provider>
    );
}
