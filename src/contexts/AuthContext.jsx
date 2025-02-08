import { createContext, useState, useContext, useEffect } from 'react';
import UserService from '@services/UserService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (UserService.isAuthenticated()) {
                const result = await UserService.getCurrentUser();
                if (result.success) {
                    setUser(result.data);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const result = await UserService.login(email, password);
        if (result.success) {
            setUser(result.data);
        }
        return result;
    };

    const logout = () => {
        UserService.logout();
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);