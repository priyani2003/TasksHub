import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BG_IMAGE =
  'https://img.magnific.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      setTasks(storedTasks ? JSON.parse(storedTasks) : []);
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Your Tasks</Text>

          {tasks.length === 0 ? (
            <Text style={styles.empty}>No tasks saved yet. Add one!</Text>
          ) : (
            tasks.map((task: any) => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.taskTitle}>{task.taskName}</Text>
                <Text style={styles.taskDescription}>
                  {task.taskDescription}
                </Text>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-task')}
          >
            <Text style={styles.buttonText}>+ Add New Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.82)' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 35 },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 18,
    color: '#111',
  },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 30, color: '#333' },
  taskCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e40af' },
  taskDescription: { fontSize: 14, marginTop: 5, color: '#333' },
  addButton: {
    backgroundColor: '#15803d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
