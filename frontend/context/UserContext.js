import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from AsyncStorage on app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    console.log('UserContext: User loaded from AsyncStorage:', parsedUser);
                } else {
                    console.log('UserContext: No user data in AsyncStorage');
                }
            } catch (error) {
                console.error('UserContext: Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    // Update user and persist to AsyncStorage
    const updateUser = useCallback(async (newUserData) => {
        try {
            if (newUserData === null) {
                // Logout - clear AsyncStorage
                await AsyncStorage.removeItem("user");
                setUser(null);
                console.log('UserContext: User logged out');
            } else {
                // Login/Update - save to AsyncStorage
                await AsyncStorage.setItem("user", JSON.stringify(newUserData));
                setUser(newUserData);
                console.log('UserContext: User updated:', newUserData);
            }
        } catch (error) {
            console.error('UserContext: Error updating user:', error);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser: updateUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};
