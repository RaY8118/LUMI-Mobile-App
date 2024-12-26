import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useRouter } from 'expo-router';


const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();


    const fetchUserData = async () => {
        const storedToken = await SecureStore.getItemAsync('token');

        if (storedToken) {
            try {
                const response = await axios.post(`${apiUrl}/get-userdata`, {}, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });

                if (response.data.status === 'success') {
                    setUser(response.data.userData);

                } else {
                    console.error('Failed to fetch user data', response.data.message);
                    Alert.alert("Error", response.data.message);
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert("Error", "Failed to fetch user data.");
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log('No token found');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const refetch = async () => {
        setIsLoading(true);
        await fetchUserData();
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, refetch, fetchUserData }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

