import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { ReclaimProofRequest } from '@reclaimprotocol/reactnative-sdk';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';

const ReclaimComponent = () => {
  const [status, setStatus] = useState('');
  const copyToClipboard = async (string: string) => {
    await Clipboard.setStringAsync(string);
  }; 
  const initializeReclaim = async () => {
    try {
      setStatus('Initializing...');
 
      const response = await axios.get('http://10.0.2.2:3000/api/v1/reclaim/generate-config');
      const { reclaimProofRequestConfig } = response.data;
 
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);
 
      const requestUrl = await reclaimProofRequest.getRequestUrl();
       await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          if (proofs) {
            if (typeof proofs === 'string') {
              console.log('SDK Message:', proofs);
            } else if (typeof proofs !== 'string') {
              console.log('Proof received:', proofs?.claimData.context);
            }
            setStatus('Proof received!');
          }
        },
        onError: (error) => {
          console.error('Verification failed', error);
          setStatus('Verification failed. Please try again.');
        },
      });
 
      console.log('Request URL:', requestUrl);
      copyToClipboard(requestUrl)
      setStatus(`Reclaim process started. Paste the URL in your clipboard in Reclaim Verifier`);
    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setStatus('Error initializing Reclaim. Please try again.');
    }
  };
 
  return (
    <View>
      <Button title="Start Reclaim Process" onPress={initializeReclaim} />
      <Text>{status}</Text>
    </View>
  );
};
 
export default ReclaimComponent;