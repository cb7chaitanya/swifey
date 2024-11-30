import { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { TextInput as PaperInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios"
import { ProfileCreation, profileCreationSchema } from "@cb7chaitanya/swifey-common/src"
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilValue } from 'recoil';
import { walletPublicKey } from '@/store/atoms/wallet';
import { API_BASE_URL } from '@/conf';
export const APP_IDENTITY = {
    name: 'Swifey',
    uri:  'http://localhost:8081',
    icon: 'favicon.ico'
};

export default function ProfileCreationForm() {
    const [name, setName] = useState('');
    const [DOB, setDOB] = useState(new Date());
    const [gender, setGender] = useState('');
    const [college, setCollege] = useState('');
    const [currentlyWorking, setCurrentlyWorking] = useState({ currentEmployment: '', role: '' });
    const [password, setPassword] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const publicKey = useRecoilValue(walletPublicKey)

    const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || DOB;
        setShowDatePicker(false);
        setDOB(currentDate);
    };

    const handleSubmit = async () => {
        try {
            const profileData: ProfileCreation = {
                name: name,
                DOB: DOB,
                gender: gender,
                college: college,
                currentlyWorking: currentlyWorking,
                password: password,
                walletAddress: 'qrhwjhkjqjrq'
            }
            const response = await axios.post(`${API_BASE_URL}/user/profile-creation`, profileData)
            if (response.status === 200) {
                const { token } = response.data;
                await AsyncStorage.setItem('auth-token', token)
                Alert.alert('Profile created successfully!');
                router.replace('/(tabs)/matcher')
            } else {
                const errorData = await response.data;
                console.error('response error', response)
            }
        } catch (error: any) {
            console.error(error)
            Alert.alert('Network error. Please check your connection.');
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center p-4 bg-white gap-3">
            <Text className="text-3xl font-bold mb-6 text-center">Create Your Profile</Text>
            <PaperInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                className="mb-4"
            />
            <Text onPress={() => setShowDatePicker(true)} className="border border-gray-300 p-4 mb-4 text-center bg-gray-100 rounded">
                {DOB.toISOString().split('T')[0]} {/* Display selected date */}
            </Text>
            {showDatePicker && (
                <DateTimePicker
                    value={DOB}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <Picker
                selectedValue={gender}
                onValueChange={(itemValue: string) => setGender(itemValue)}
                className="border border-gray-300 mb-4 bg-white"
            >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
            </Picker>
            <PaperInput
                label="College"
                value={college}
                onChangeText={setCollege}
                mode="outlined"
                className="mb-4"
            />
            <PaperInput
                label="Current Employment"
                value={currentlyWorking.currentEmployment}
                onChangeText={(text) => setCurrentlyWorking({ ...currentlyWorking, currentEmployment: text })}
                mode="outlined"
                className="mb-4"
            />
            <PaperInput
                label="Role"
                value={currentlyWorking.role}
                onChangeText={(text) => setCurrentlyWorking({ ...currentlyWorking, role: text })}
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
            <Button children={'Create Profile'} onPress={handleSubmit} className="bg-zinc-700" />
            <Link href="/signin">
                <Text className="text-center text-blue-500 mt-4">Already a user? Sign in</Text>
            </Link>
        </SafeAreaView>
    );
}