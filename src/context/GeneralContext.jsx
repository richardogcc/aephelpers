'use client'

import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function useGeneralContext() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [identifier, setIdentifier] = useState('');
    const [identifierNamespace, setIdentifierNamespace] = useState('pairwise');
    const [response, setResponse] = useState({});

    const value = {
        identifier,
        setIdentifier,
        identifierNamespace,
        setIdentifierNamespace,
        response,
        setResponse,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;