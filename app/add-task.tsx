import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BG_IMAGE =
  'https://img.magnific.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80';

const BANNER_IMAGE =
  'https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-task-management-illustration-concept-on-white-background-vector.jpg';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const saveTask = async () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasksArray = existingTasks ? JSON.parse(existingTasks) : [];

      const newTask = {
        id: Date.now().toString(),
        taskName: taskName.trim(),
        taskDescription: taskDescription.trim(),
      };

      tasksArray.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksArray));

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Saved Successfully! 📚',
          body: `Don't forget to complete your ${newTask.taskName}.`,
        },
        trigger: null,
      });

      router.back();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Task</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={{ uri: BANNER_IMAGE }}
            style={styles.banner}
            resizeMode="contain"
          />

          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={taskName}
            onChangeText={setTaskName}
          />

          <Text style={styles.label}>Task Descripton</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter task description"
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
            <Text style={styles.buttonText}>Save Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.88)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: { marginRight: 14, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#111' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 35 },
  banner: {
    width: '100%',
    height: 155,
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#111' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
  },
  descriptionInput: { height: 100 },
  saveButton: {
    backgroundColor: '#15803d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
