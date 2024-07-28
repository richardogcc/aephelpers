'use client'

import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function useInitialConfigContext() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [envVariables, setEnvVariables] = useState({});
    const [devEnvVariables, setDevEnvVariables] = useState({
        ENABLED: false,
        CLIENT_SECRET: '',
        CLIENT_ID: '',
        API_KEY: '',
        IMS: 'ims-na1.adobelogin.com',
        IMS_ORG: '',
        TECHNICAL_ACCOUNT_ID: '',
        ACCESS_TOKEN: '',
        SANDBOX_NAME: '',
        SCOPES: '',
        META_SCOPE: '',
    });

    const [prodEnvVariables, setProdEnvVariables] = useState({
        ENABLED: false,
        CLIENT_SECRET: '',
        CLIENT_ID: '',
        API_KEY: '',
        IMS: 'ims-na1.adobelogin.com',
        IMS_ORG: '',
        TECHNICAL_ACCOUNT_ID: '',
        ACCESS_TOKEN: '',
        SANDBOX_NAME: '',
        SCOPES: '',
        META_SCOPE: '',
    });

    const checkLocalStorageConfig = () => {
        const configKey = "aepHelpersConfig";
        const config = localStorage.getItem(configKey);

        if (!config || !(JSON.parse(config)).configured) {
            localStorage.setItem(
                configKey,
                JSON.stringify({
                    configured: false,
                    dev: {
                        ENABLED: true,
                        CLIENT_SECRET: '',
                        CLIENT_ID: '',
                        API_KEY: '',
                        IMS: 'ims-na1.adobelogin.com',
                        IMS_ORG: '',
                        TECHNICAL_ACCOUNT_ID: '',
                        ACCESS_TOKEN: '',
                        SANDBOX_NAME: '',
                        SCOPES: '',
                        META_SCOPE: '',
                    },
                    prod: {
                        ENABLED: false,
                        CLIENT_SECRET: '',
                        CLIENT_ID: '',
                        API_KEY: '',
                        IMS: 'ims-na1.adobelogin.com',
                        IMS_ORG: '',
                        TECHNICAL_ACCOUNT_ID: '',
                        ACCESS_TOKEN: '',
                        SANDBOX_NAME: '',
                        SCOPES: '',
                        META_SCOPE: '',
                    }
                })
            );
            setShowModal(true);
        }

        if (config) {
            const { configured, dev, prod } = JSON.parse(config);
            if (!configured) setShowModal(true);

            setDevEnvVariables({ ...dev });
            setProdEnvVariables({ ...prod });

            if (configured && dev.ENABLED) setEnvVariables({ ...dev, ENABLED: true });
            else if (configured && prod.ENABLED) setEnvVariables({ ...prod, ENABLED: true });
        }
    };

    const value = {
        showModal,
        setShowModal,
        envVariables,
        setEnvVariables,
        devEnvVariables,
        setDevEnvVariables,
        prodEnvVariables,
        setProdEnvVariables,
        checkLocalStorageConfig
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;