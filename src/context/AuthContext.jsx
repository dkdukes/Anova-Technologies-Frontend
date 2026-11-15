
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );

    const [loading, setLoading] = useState(true);

    // Restore authentication when the application starts
    useEffect(() => {
        const restoreAuthentication = () => {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("accessToken");
            const storedRefresh = localStorage.getItem("refreshToken");

            if (!storedUser || !storedToken || !storedRefresh) {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                setUser(null);
                setAccessToken(null);
                setLoading(false);

                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser);

                setUser(parsedUser);
                setAccessToken(storedToken);
            } catch (error) {
                console.error(
                    "Failed to restore authentication:",
                    error
                );

                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                setUser(null);
                setAccessToken(null);
            }

            setLoading(false);
        };

        restoreAuthentication();
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

        // Store authentication credentials
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify(user));

        // Update authentication state
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

        // Notify other contexts and Axios
        window.dispatchEvent(new Event("auth:logout"));
    };

    // Synchronize token refresh and automatic logout
    useEffect(() => {
        const handleTokenRefreshed = (event) => {
            setAccessToken(event.detail.accessToken);
        };

        const handleAuthLogout = () => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            setAccessToken(null);
            setUser(null);
        };

        window.addEventListener(
            "auth:token-refreshed",
            handleTokenRefreshed
        );

        window.addEventListener(
            "auth:logout",
            handleAuthLogout
        );

        return () => {
            window.removeEventListener(
                "auth:token-refreshed",
                handleTokenRefreshed
            );

            window.removeEventListener(
                "auth:logout",
                handleAuthLogout
            );
        };
    }, []);

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
