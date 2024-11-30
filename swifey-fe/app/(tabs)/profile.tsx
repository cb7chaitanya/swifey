import { View, Text, Button } from "react-native"
import { useEffect, useState } from "react"
import axios from "axios"
import ReclaimComponent from "@/components/Reclaim";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/conf";

interface Connection {
    id: string;
    stakingStatus: string;
    connectionDate: string | null;
    chatHistoryRetained: boolean;
}

interface User {
    name: string;
    dateOfBirth: string;
    gender: string;
    graduatedFrom: string;
    currentlyWorking: string;
    walletAddress: string;
    role: string;
    connections: Connection[];
    verificationStatus: string;
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('auth-token')
                const response = await axios.get(`${API_BASE_URL}/user/your-profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('response', response.status)
                if(response.status === 200){
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Error fetching user profile", error);
            }
        };
        fetchUserProfile();
        console.log('user', user)
    }, []);

    return (
        <View>
            {user ? (
                <>
                    <Text>Name: {user.name}</Text>
                    <Text>Date of Birth: {user.dateOfBirth}</Text>
                    <Text>Gender: {user.gender}</Text>
                    <Text>Graduated From: {user.graduatedFrom}</Text>
                    <Text>Currently Working: {user.currentlyWorking}</Text>
                    <Text>Wallet Address: {user.walletAddress}</Text>
                    <Text>Role: {user.role}</Text>
                    {user.verificationStatus === "UNVERIFIED" ? (
                        <ReclaimComponent />
                    ): (
                        <Text>Verification Status: {user.verificationStatus}</Text>
                    )}
                </>
            ) : (
                <Text>Loading...</Text>
            )}
            
        </View>
    )
}