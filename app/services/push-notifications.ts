import { Platform } from 'react-native';
import Constants from 'expo-constants';

let Notifications: any = null;
let Device: any = null;

if (Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications').default || require('expo-notifications');
    Device = require('expo-device').default || require('expo-device');
    
    if (Notifications && Notifications.setNotificationHandler) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  } catch (error) {
    console.log('[Push] Push notifications not available in Expo Go (SDK 53+). Use a development build.');
    Notifications = null;
    Device = null;
  }
}

export interface PushNotificationToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
}

export async function registerForPushNotificationsAsync(): Promise<PushNotificationToken | null> {
  if (!Notifications || !Device) {
    console.log('[Push] Push notifications not available - requires development build');
    return null;
  }

  if (Platform.OS === 'web') {
    console.log('[Push] Web platform - notifications not fully supported');
    return null;
  }

  if (!Device.isDevice) {
    console.log('[Push] Must use physical device for push notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Push] Permission not granted');
    return null;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    console.log('[Push] Token obtained:', tokenData.data);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#D4AF37',
      });
    }

    return {
      token: tokenData.data,
      platform: Platform.OS as 'ios' | 'android',
    };
  } catch (error) {
    console.error('[Push] Error getting token:', error);
    return null;
  }
}

export async function schedulePushNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  trigger?: any
) {
  if (!Notifications) {
    console.log('[Push] Push notifications not available - requires development build');
    return null;
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null,
    });
    console.log('[Push] Scheduled notification:', id);
    return id;
  } catch (error) {
    console.error('[Push] Error scheduling notification:', error);
    return null;
  }
}

export async function cancelNotification(notificationId: string) {
  if (!Notifications) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('[Push] Cancelled notification:', notificationId);
  } catch (error) {
    console.error('[Push] Error cancelling notification:', error);
  }
}

export async function cancelAllNotifications() {
  if (!Notifications) {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Push] Cancelled all notifications');
  } catch (error) {
    console.error('[Push] Error cancelling all notifications:', error);
  }
}

export function addNotificationReceivedListener(
  handler: (notification: any) => void
) {
  if (!Notifications) {
    return { remove: () => {} };
  }
  return Notifications.addNotificationReceivedListener(handler);
}

export function addNotificationResponseReceivedListener(
  handler: (response: any) => void
) {
  if (!Notifications) {
    return { remove: () => {} };
  }
  return Notifications.addNotificationResponseReceivedListener(handler);
}
