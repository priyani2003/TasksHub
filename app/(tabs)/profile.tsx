
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('studentProfile');

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setName(profile.name);
        setStudentId(profile.id);
        setImageUri(profile.imageUri || '');
      }
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow gallery access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveProfileData = async () => {
    if (!name || !studentId) {
      Alert.alert('Error', 'Please enter your name and student ID');
      return;
    }

    try {
      const profile = {
        name,
        id: studentId,
        imageUri,
      };

      await AsyncStorage.setItem(
        'studentProfile',
        JSON.stringify(profile)
      );

      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setName('');
      setStudentId('');
      setImageUri('');
      Alert.alert('Success', 'All tasks cleared!');
    } catch (error) {
      console.error('Failed to clear data', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri: imageUri ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.heading}>Student Profile</Text>

      <Text style={styles.label}>Student Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Student ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your student ID"
        value={studentId}
        onChangeText={setStudentId}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveProfileData}
      >
        <Text style={styles.buttonText}>Save Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearAllData}
      >
        <Text style={styles.buttonText}>Clear All Tasks</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

