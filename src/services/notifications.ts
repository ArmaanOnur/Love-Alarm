import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from './api';

// Set the default notification handler (foreground behaviour)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request permission and register an Expo push token with the backend.
 * Returns the token string or null if permission denied.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alarm', {
      name: 'Alarm Bildirimleri',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF5F8D',
      sound: 'alarm.mp3',
    });

    await Notifications.setNotificationChannelAsync('matches', {
      name: 'Eşleşme Bildirimleri',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#7B61FF',
    });

    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Mesaj Bildirimleri',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  const projectId = process.env.EXPO_PUBLIC_EXPO_PROJECT_ID;
  const token = await Notifications.getExpoPushTokenAsync({ projectId });

  // Register with backend
  try {
    await api.post('/notifications/token', { token: token.data });
  } catch (err) {
    console.warn('[Notifications] Failed to register token with backend:', err);
  }

  return token.data;
}

/**
 * Schedule a local alarm notification (used for testing without FCM).
 */
export async function scheduleLocalAlarm(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💘 Alarm Çalıyor!',
      body: '10 metre yakınında biri var!',
      sound: 'alarm.mp3',
      data: { type: 'alarm' },
    },
    trigger: null, // immediate
  });
}

/**
 * Clear all displayed notifications.
 */
export async function clearAllNotifications(): Promise<void> {
  await Notifications.dismissAllNotificationsAsync();
}
