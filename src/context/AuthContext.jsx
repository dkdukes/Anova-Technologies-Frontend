
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );
    const [loading, setLoading] = useState(true);

    // Restore logged-in user when the application starts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to restore user:", error);
                localStorage.removeItem("user");
            }
        }

        setLoading(false);
    }, []);

    // Register customer
    const register = async (userData) => {
        const response = await api.post(
            "customers/auth/register/",
            userData
        );

        return response.data;
    };

    // Login
    const login = async (username, password) => {
        const response = await api.post(
            "customers/auth/login/",
            {
                username,
                password,
            }
        );

        const { access, refresh, user } = response.data;

        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify(user));

        setAccessToken(access);
        setUser(user);

        return response.data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        setAccessToken(null);
        setUser(null);
    };

    const value = {
        user,
        accessToken,
        loading,
        register,
        login,
        logout,

        isAuthenticated: !!accessToken,

        isCustomer: user?.role === "customer",
        isStaff: user?.role === "staff",
        isAdmin: user?.role === "admin",
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}

