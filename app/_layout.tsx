
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';

// Ensure notifications show when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add-task"
        options={{
          presentation: 'modal',
          title: 'Add New Task',
        }}
      />
    </Stack>
  );
}


