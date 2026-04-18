import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from '../services/notifications';
import type { AppNotification, NotificationType } from '../types/alarm';

type NotificationHandler = (notification: AppNotification) => void;

export function useNotifications(onReceive?: NotificationHandler) {
  const listenerRef = useRef<Notifications.EventSubscription | null>(null);
  const responseRef = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Register push token on mount
    registerForPushNotifications().catch(console.warn);

    // Foreground notification handler
    listenerRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data as Record<string, string>;
        const appNotif: AppNotification = {
          id: notification.request.identifier,
          type: (data.type as NotificationType) ?? 'alarm',
          title: notification.request.content.title ?? '',
          body: notification.request.content.body ?? '',
          data,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        onReceive?.(appNotif);
      },
    );

    // User tapped notification (background → foreground)
    responseRef.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, string>;
        console.log('[Notifications] User tapped:', data);
        // Navigation handled by the root _layout.tsx via Linking
      },
    );

    return () => {
      listenerRef.current?.remove();
      responseRef.current?.remove();
    };
  }, [onReceive]);
}
