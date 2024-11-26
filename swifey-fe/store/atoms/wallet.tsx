import { atom } from 'recoil'
import ReactNativeRecoilPersist from "react-native-recoil-persist";
import { PublicKey } from '@solana/web3.js';

export const walletConnected = atom({
    default: false,
    key: "walletConnected",
    effects_UNSTABLE: [ReactNativeRecoilPersist.persistAtom]
})

export const walletPublicKey = atom<PublicKey | null>({
    default: null,
    key: "walletPublicKey",
    effects_UNSTABLE: [ReactNativeRecoilPersist.persistAtom]
})