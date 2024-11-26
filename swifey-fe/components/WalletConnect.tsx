import React from "react";
import { SafeAreaView, View, Button } from "react-native";
import { useWallet } from '../hooks/useWallet';
import { useRecoilState } from "recoil";
import { walletConnected } from "@/store/atoms/wallet";


export default function WalletConnect() {
  const { connect, disconnect } = useWallet();
  const [isConnected, setIsConnected] = useRecoilState(walletConnected);
  return (
    <SafeAreaView className="flex">
      <View className="absolute top-0 flex-row justify-between p-4">
        {isConnected ? (
          <Btn title="Disconnect wallet" onPress={() => {
            // disconnect(); Throws bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?) might be a jsc issue
            setIsConnected(false);
          }} />
        ) : (
          <Btn title="Connect wallet" onPress={connect} />
        )}
      </View>
    </SafeAreaView>
  );
}

const Btn = ({ title, onPress }: { title: string; onPress: any }) => {
  return (
    <View className="">
      <Button title={title} onPress={onPress} />
    </View>
  );
};