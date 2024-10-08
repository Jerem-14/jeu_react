import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [token, setToken] = useState(null); 
    const [isAuthResolved, setIsAuthResolved] = useState(false);

    // Au montage, vérifie si un token est présent dans sessionStorage
    useEffect(() => {
        const savedToken = sessionStorage.getItem("token");
        console.log("Token récupéré depuis sessionStorage au montage:", savedToken);
        if (savedToken) {
            setToken(savedToken);
        }
        setIsAuthResolved(true);
    }, []);

    // Sauvegarde ou supprime le token dans sessionStorage à chaque mise à jour
    useEffect(() => {
        if (token) {
            sessionStorage.setItem("token", token);
            console.log("Token sauvegardé dans sessionStorage:", token);
        } else {
            sessionStorage.removeItem("token");
            console.log("Token supprimé de sessionStorage");
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
