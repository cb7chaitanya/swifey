import WalletConnect from "@/components/WalletConnect";
import { walletPublicKey } from "@/store/atoms/wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";

export default function LandingPage() {
  const fetchTokenAndRedirect = async() => {
    const token = await AsyncStorage.getItem('auth-token')
    const phantomWalletAddress = useRecoilValue(walletPublicKey)
    if(token && phantomWalletAddress){
      router.replace('/(tabs)/matcher')
    }
    return
  }
  useEffect(() => {
    // fetchTokenAndRedirect()
  }, [])
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-5xl font-bold text-blue-600 mb-4">
        Welcome to Swifey
      </Text>
      <Text className="text-lg text-gray-700 mb-6 text-center">
        Connect with people around the world through the power of Solana.
      </Text>
      <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-blue-600">
        <Link href={"/profileCreate"}>
          <Text className="text-white font-semibold">Get Started</Text>
        </Link>
      </TouchableOpacity>
      <WalletConnect />
      <Text className="mt-4 text-gray-500 text-sm">
        Join us and start connecting today!
      </Text>
    </View>
  );
}
