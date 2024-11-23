import React from 'react';
import { Button, Text, View } from 'react-native';

export default function LandingPage() {
    const handleGetStarted = () => {
        console.log("Get Started button pressed");
    };

    return (
        <View className="flex-1 bg-black justify-center items-center p-5">
            <Text className="text-white text-4xl font-bold mb-2">Welcome to Our Social Platform</Text>
            <Text className="text-gray-400 text-lg text-center mb-5">
                Connect with others, create your profile, and start your journey!
            </Text>
            <Button 
                title="Get Started" 
                onPress={handleGetStarted} 
                color="#4F46E5"
            />
        </View>
    );
}