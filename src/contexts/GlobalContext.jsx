import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [token, setToken] = useState(null); 
    const [isAuthResolved, setIsAuthResolved] = useState(false);

    // Au montage, vérifie si un token est présent dans localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        console.log("Token récupéré depuis localStorage au montage:", savedToken);
        if (savedToken) {
            setToken(savedToken);
        }
        setIsAuthResolved(true);
    }, []);

    // Sauvegarde ou supprime le token dans localStorage à chaque mise à jour
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            console.log("Token sauvegardé dans localStorage:", token);
        } else {
            localStorage.removeItem("token");
            console.log("Token supprimé de localStorage");
        }
    }, [token]);

    const saveToken = (newToken) => {
        console.log("Token sauvegardé avec saveToken:", newToken);
        setToken(newToken);
    };

    const isAuthenticated = () => {
        const authenticated = token !== null;
        console.log("isAuthenticated appelé:", authenticated);
        return authenticated;
    };

    return (
        <GlobalContext.Provider value={{ token, saveToken, isAuthenticated, isAuthResolved }}>
            {children}
        </GlobalContext.Provider>
    );
};
