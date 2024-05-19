import React, {createContext, useContext, useState, useEffect, ReactNode, useMemo} from 'react';
import mondaySdk from 'monday-sdk-js';

interface MondayContextData {
    context?: any;
    settings?: any;
    sessionToken?: any;
    filters?: any;
    isLoaded?: boolean;
    monday: mondaySdk.MondayClientSdk;
}

const MondayContext = createContext<MondayContextData>({
    monday: mondaySdk(),
});

export const useMondayContext = () => useContext(MondayContext);

export const MondayProvider = ({children}) => {
    const monday = mondaySdk();
    const [context, setContext] = useState<any>();
    const [settings, setSettings] = useState<any>();
    const [sessionToken, setSessionToken] = useState<any>()

    useEffect(() => {
        // Listening for context updates
        monday.listen('context', (res) => {
            setContext(res.data);
        });

        // Listening for settings updates
        monday.listen('settings', (res) => {
            setSettings(res.data);
        });

        monday.get('sessionToken').then((token) => setSessionToken(token))
    }, []);

    monday.execute('valueCreatedForUser')

    // memoize the context value
    const contextValue = useMemo(() => ({
        context,
        settings,
        sessionToken,
        isLoaded: !!context && !!settings,
        monday,
    }), [context, settings, sessionToken]);

    return (
        <MondayContext.Provider value={contextValue}>
            {children}
        </MondayContext.Provider>
    );
};