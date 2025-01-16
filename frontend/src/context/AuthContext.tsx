import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    Area: string | null;
    login_attempt: number | null;
}

interface TokenData {
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    prv: string;
    sub: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('authToken');
        const storedUser = sessionStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const tokenParts = storedToken.split('.');
                if (tokenParts.length !== 3) throw new Error('Invalid token format');

                const tokenData = JSON.parse(atob(tokenParts[1])) as TokenData;
                const isTokenValid = tokenData.exp * 1000 > Date.now();

                if (isTokenValid) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                } else {
                    // Token expired, clean up
                    sessionStorage.removeItem('authToken');
                    sessionStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Auth validation error:', error);
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        sessionStorage.setItem('authToken', newToken);
        sessionStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};