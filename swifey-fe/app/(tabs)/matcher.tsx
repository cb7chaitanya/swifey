import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedStack from "../../components/AnimatedStack";
import Card from "../../components/Card";
import { useWallet } from "@/hooks/useWallet";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRecoilValue } from "recoil";
import { walletPublicKey } from "@/store/atoms/wallet";
import { PublicKey } from "@solana/web3.js";
import { API_BASE_URL } from "@/conf";

const Tab = createMaterialTopTabNavigator();

export interface Profile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  graduatedFrom: string;
  currentlyWorking: string;
  walletAddress: string;
  role: string;
  connections: any[];
  avatarUrl: string;
}

const dummyProfiles: Profile[] = [
  {
    id: "1",
    name: "John Doe",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    graduatedFrom: "University A",
    currentlyWorking: "Company A",
    walletAddress: "walletAddress1",
    role: "Developer",
    connections: [],
    avatarUrl:
      "https://i.pinimg.com/736x/aa/ea/02/aaea02ca5c48d09ac86a591a21c18460.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    dateOfBirth: "1992-02-02",
    gender: "Female",
    graduatedFrom: "University B",
    currentlyWorking: "Company B",
    walletAddress: "walletAddress2",
    role: "Designer",
    connections: [],
    avatarUrl:
      "https://i.pinimg.com/736x/aa/ea/02/aaea02ca5c48d09ac86a591a21c18460.jpg",
  },
];

const platformWalletAddress = new PublicKey(
  "H2ZFj5AwnN18iCqMgXsuohgU5GWTmEEJ6ahtE1es5F8C"
);

export default function Matcher() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Pending Outgoing"
        component={PendingOutgoingConnections}
      />
      <Tab.Screen name="Matcher" component={MatchingUI} />
      <Tab.Screen
        name="Pending Received"
        component={PendingReceivedConnections}
      />
    </Tab.Navigator>
  );
}

function MatchingUI() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { signAndSendTransaction } = useWallet();
  const walletAddress = useRecoilValue(walletPublicKey);
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = await AsyncStorage.getItem("auth-token");
        const response = await axios.get(
          `${API_BASE_URL}/user/unmatched-profiles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);
  const initiateConnect = async (otherUserId: string) => {
    const body = {
      transactionHash: "", //Being set to an empty string because we still have to retrieve hash from the transaction
      otherUserId,
    };
    try {
      const token = await AsyncStorage.getItem("auth-token");
      await axios.post(
        `${API_BASE_URL}/user/initiate-connection`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error initiating connection", error);
    }
  };

  const onSwipeLeft = (profile: Profile) => {
    console.log(`Rejected ${profile.name}`);
    // Logic to handle rejection
  };

  const onSwipeRight = async (profile: Profile) => {
    console.log("control reaches here");
    // await signAndSendTransaction(walletAddress!, platformWalletAddress)
    // This has the staking logic but isn't working because: Throws bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?) might be a jsc issue
    await initiateConnect(profile.id);
    console.log(`Connected with ${profile.name}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Animated Stack for Profile Cards */}
      <AnimatedStack
        data={profiles}
        renderItem={({ item }: { item: Profile }) => <Card user={item} />}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />

      {/* Footer */}
      <View className="p-4 bg-white shadow-md">
        <Text className="text-center text-gray-600">
          Swipe left to reject or right to connect!
        </Text>
      </View>
    </SafeAreaView>
  );
}

function PendingOutgoingConnections() {
  const [pendingOutgoing, setPendingOutgoing] =
    useState<Profile[]>(dummyProfiles);
  const { signAndSendTransaction } = useWallet();
  const walletAddress = useRecoilValue(walletPublicKey);
  useEffect(() => {
    const fetchPendingOutgoing = async () => {
      const token = await AsyncStorage.getItem("auth-token");
      const response = await axios.get(
        `${API_BASE_URL}/user/pending-outgoing-connections`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingOutgoing(response.data.pendingOutgoingConnections);
    };
    // fetchPendingOutgoing();
  }, []);

  const onPressHandler = async () => {
    // await signAndSendTransaction(platformWalletAddress, walletAddress!);
    const token = await AsyncStorage.getItem("auth-token");
    const response = await axios.delete(
      `${API_BASE_URL}/user/decline-connection`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("responseData", response.data);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {pendingOutgoing.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">No outgoing connections found.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingOutgoing}
          renderItem={({ item }) => (
            <View className="flex-row items-center bg-white p-4 mb-2 rounded-lg shadow">
              <Image
                source={{ uri: item.avatarUrl }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="font-bold">{item.name}</Text>
                <Text className="text-gray-500">Pending Connection</Text>
              </View>
              <TouchableOpacity
                className="bg-blue-500 px-2 py-1"
                onPress={() => {
                  onPressHandler();
                }}
              >
                <Text className="text-white">Unstake 0.2 Sol</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

function PendingReceivedConnections() {
  const [pendingReceived, setPendingReceived] =
    useState<Profile[]>(dummyProfiles);
  const { signAndSendTransaction } = useWallet();
  const walletAddress = useRecoilValue(walletPublicKey);
  useEffect(() => {
    const fetchPendingReceived = async () => {
      const token = await AsyncStorage.getItem("auth-token");
      const response = await axios.get(
        `${API_BASE_URL}/user/pending-recieved-connections`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingReceived(response.data.pendingReceivedConnections);
    };
    // fetchPendingReceived();
  }, []);

  const onPressHandler = async (otherUserId: string) => {
    // await signAndSendTransaction(platformWalletAddress, walletAddress!)
    const token = await AsyncStorage.getItem("auth-token");
    const response = await axios.delete(
      `${API_BASE_URL}/user/decline-connection`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("responseData", response.data);
    setPendingReceived(prev => prev.filter(profile => profile.id !== otherUserId));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {pendingReceived.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">No received connections found.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingReceived}
          renderItem={({ item }) => (
            <View className="flex-row items-center bg-white p-4 mb-2 rounded-lg shadow">
              <Image
                source={{ uri: item.avatarUrl }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="font-bold">{item.name}</Text>
                <Text className="text-gray-500">
                  Received Connection Request
                </Text>
              </View>
              <View className="flex-row gap-6">
                <TouchableOpacity
                  onPress={async () => {
                    // await signAndSendTransaction(walletAddress, platformWalletAddress)
                    const token = await AsyncStorage.getItem("auth-token");
                    const otherUserId = item.id;
                    const body = {
                      otherUserId: otherUserId,
                    };
                    const response = await axios.put(
                      `${API_BASE_URL}/user/accept-connection`,
                      body,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    console.log("responseData", response.data);
                    setPendingReceived(prev => prev.filter(profile => profile.id !== otherUserId));
                  }}
                >
                  <Icon name="check" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onPressHandler(item.id);
                  }}
                >
                  <Icon name="times" size={24} color="#FF6347" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}
