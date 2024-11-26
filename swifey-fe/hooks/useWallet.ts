import { useCallback, useEffect, useState } from "react";
import * as Linking from "expo-linking";
import nacl from "tweetnacl";
import bs58 from "bs58";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useRecoilState, useSetRecoilState } from "recoil";
import { walletConnected, walletPublicKey } from "../store/atoms/wallet";

const NETWORK = clusterApiUrl("devnet");

export const useWallet = () => {
  const connection = new Connection(NETWORK);
  const [deepLink, setDeepLink] = useState<string>("");
  const [dappKeyPair] = useState(nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array>();
  const [session, setSession] = useState<string>();
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
    useRecoilState(walletPublicKey);
  const setIsConnected = useSetRecoilState(walletConnected);

  const onConnectRedirectLink = "exp://ykvceno-cb7chaitanya-8081.exp.direct";
  const onDisconnectRedirectLink = "exp://ykvceno-cb7chaitanya-8081.exp.direct/profileCreate";
  const onSignAndSendTransactionRedirectLink =
    "exp://192.168.1.8:8081/(tabs)/matcher";

  const buildUrl = (path: string, params: URLSearchParams) =>
    `https://phantom.app/ul/v1/${path}?${params.toString()}`;

  const decryptPayload = (
    data: string,
    nonce: string,
    sharedSecret?: Uint8Array
  ) => {
    if (!sharedSecret) throw new Error("missing shared secret");

    const decryptedData = nacl.box.open.after(
      bs58.decode(data),
      bs58.decode(nonce),
      sharedSecret
    );
    if (!decryptedData) {
      throw new Error("Unable to decrypt data");
    }
    return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
  };

  const encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
    if (!sharedSecret) throw new Error("missing shared secret");

    const nonce = nacl.randomBytes(24);

    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      sharedSecret
    );

    return [nonce, encryptedPayload];
  };

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    })();
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = ({ url }: Linking.EventType) => {
    setDeepLink(url);
  };

  useEffect(() => {
    console.log('deepLink', deepLink)
    if (!deepLink) return;
    const url = new URL(deepLink);
    const params = url.searchParams;
    console.log("URL", url);
    if (params.get("errorCode")) {
      console.log(JSON.stringify(Object.fromEntries([...params]), null, 2));
      return;
    }
    const publicEncryptionKey = params.get("phantom_encryption_public_key");
    console.log('publicEncryptionKey',publicEncryptionKey)
    // Handle different deep link actions
    if (publicEncryptionKey) {
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(params.get("phantom_encryption_public_key")!),
        dappKeyPair.secretKey
      );

      const connectData = decryptPayload(
        params.get("data")!,
        params.get("nonce")!,
        sharedSecretDapp
      );

      setSharedSecret(sharedSecretDapp);
      setSession(connectData.session);
      setPhantomWalletPublicKey(new PublicKey(connectData.public_key));

      console.log(JSON.stringify(connectData, null, 2));
    } else if (/profileCreate/.test(url.pathname)) {
      console.log("Disconnected!");
    } else if (/onSignAndSendTransaction/.test(url.pathname)) {
      const signAndSendTransactionData = decryptPayload(
        params.get("data")!,
        params.get("nonce")!,
        sharedSecret
      );

      console.log(JSON.stringify(signAndSendTransactionData, null, 2));
    } 
  }, [deepLink]);

  const createTransferTransaction = async (fromPubKey: PublicKey, toPubKey: PublicKey) => {
    console.log("phantomWalletPublicKey", phantomWalletPublicKey);
    if (!phantomWalletPublicKey) {
      console.error("missing public key from user");
      return;
    }
    console.log("control reaches here");
    console.log("transaction");
    console.log("publicKey");
    let transaction = new Transaction()
    const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: LAMPORTS_PER_SOL * 0.2
    })
    transaction.add(sendSolInstruction)
    return transaction;
  };

  const connect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "devnet",
      app_url: "https://phantom.app",
      redirect_link: onConnectRedirectLink,
    });

    const url = buildUrl("connect", params);
    Linking.openURL(url);
    setIsConnected(true);
  };
  
  //Throws bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?) might be a jsc issue
  const disconnect = async () => {
    console.log("control reaches here");
    const payload = {
      session,
    };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    console.log('here too')
    const url = buildUrl("disconnect", params);
    Linking.openURL(url);
  };

  const signAndSendTransaction = async (fromPubKey:PublicKey, toPubKey: PublicKey) => {
    const transaction = await createTransferTransaction(fromPubKey, toPubKey);
    if (!transaction) {
      console.log("transaction not formed");
      return;
    }
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: true,
      verifySignatures: true
    });

    const payload = {
      session,
      transaction: bs58.encode(serializedTransaction),
    };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onSignAndSendTransactionRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    console.log("Sending transaction...");
    const url = buildUrl("signAndSendTransaction", params);
    Linking.openURL(url);
  };

  return {
    connect,
    disconnect,
    signAndSendTransaction,
  };
};
