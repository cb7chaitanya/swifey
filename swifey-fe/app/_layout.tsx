import WalletConnect from "@/components/WalletConnect";
import "../global.css";
import { Slot, Tabs } from "expo-router";
import { SafeAreaView } from "react-native";
import ReactNativeRecoilPersist, {
  ReactNativeRecoilPersistGate,
} from "react-native-recoil-persist";
import { RecoilRoot } from "recoil";

export default function RootLayout({ children }: {children: any}) {
  return (
    <RecoilRoot>
      <ReactNativeRecoilPersistGate store={ReactNativeRecoilPersist}>
          <Slot />
      </ReactNativeRecoilPersistGate>
    </RecoilRoot>
  );
}
