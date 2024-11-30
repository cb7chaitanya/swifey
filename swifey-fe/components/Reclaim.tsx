import React, { useState } from 'react';
import { View, Button, Text, Linking, Platform } from 'react-native';
import { ReclaimProofRequest } from '@reclaimprotocol/reactnative-sdk';
import axios from 'axios';
import { API_BASE_URL } from '@/conf';

const ReclaimComponent = () => {
  const [status, setStatus] = useState('');

  const initializeReclaim = async () => {
    try {
      setStatus('Initializing...');
 
      const response = await axios.get(`${API_BASE_URL}/reclaim/generate-config`);
      const { reclaimProofRequestConfig } = response.data;
      
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);
 
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      await Linking.openURL(requestUrl)
       await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          console.log(proofs)
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
      setStatus(`Reclaim process started. Paste the URL in your clipboard in Reclaim Verifier`);
    } catch (error) {
      console.error('Error initializing Reclaim:', error);
      setStatus('Error initializing Reclaim. Please try again.');
    }
  };
  if(Platform.OS === 'web'){
    return (
      <View>
        <Text>Reclaim verification is not supported on web platforms.</Text>
      </View>
    );
  }
  return (
    <View>
      <Button title="Start Reclaim Process" onPress={initializeReclaim} />
      <Text>{status}</Text>
    </View>
  );
};
 
export default ReclaimComponent;