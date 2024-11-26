import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { TextInput as PaperInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';

export default function SignInForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:3000/api/v1/user/signin', { walletAddress, password });
            if (response.status === 200) {
                const { token } = response.data;
                await AsyncStorage.setItem('auth-token', token);
                Alert.alert('Sign in successful!');
                router.replace('/(tabs)/matcher'); // Redirect to home or another page
            } else {
                Alert.alert('Sign in failed. Please check your credentials.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Network error. Please check your connection.');
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center p-4 bg-white gap-3">
            <Text className="text-3xl font-bold mb-6 text-center">Sign In</Text>
            <PaperInput
                label="Wallet Address"
                value={walletAddress}
                onChangeText={setWalletAddress}
                mode="outlined"
                className="mb-4"
            />
            <PaperInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                className="mb-4"
            />
            <Button children={'Sign In'} onPress={handleSubmit} className="bg-zinc-700" />
            <Link href="/profileCreate">
                <Text className="text-center text-blue-500 mt-4">A new user?
                Create your profile</Text> 
            </Link>
        </SafeAreaView>
    );
}
