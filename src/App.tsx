import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type PermissionState = 'unknown' | 'granted' | 'denied' | 'unavailable';

export default function App() {
  const [permissionState, setPermissionState] = useState<PermissionState>('unknown');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [lastNotification, setLastNotification] = useState('No notifications received yet.');
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    void registerForNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setLastNotification(notification.request.content.title ?? 'Notification received');
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setLastNotification(response.notification.request.content.title ?? 'Notification opened');
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  async function registerForNotifications() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    if (!Device.isDevice) {
      setPermissionState('unavailable');
      return;
    }

    const existingPermission = await Notifications.getPermissionsAsync();
    let finalStatus = existingPermission.status;

    if (existingPermission.status !== 'granted') {
      const requestedPermission = await Notifications.requestPermissionsAsync();
      finalStatus = requestedPermission.status;
    }

    if (finalStatus !== 'granted') {
      setPermissionState('denied');
      return;
    }

    setPermissionState('granted');

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

    if (!projectId) {
      setExpoPushToken('Missing EAS project ID');
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    setExpoPushToken(token.data);
  }

  async function scheduleLocalNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'iOS Apps is ready',
        body: 'This is a local notification from your standalone-ready Expo app.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
  }

  function showToken() {
    if (!expoPushToken) {
      Alert.alert('Push token', 'No push token is available yet.');
      return;
    }

    Alert.alert('Expo push token', expoPushToken);
  }

  const permissionLabel = {
    unknown: 'Checking',
    granted: 'Enabled',
    denied: 'Denied',
    unavailable: 'Device only',
  }[permissionState];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Standalone app setup</Text>
          <Text style={styles.title}>iOS Apps</Text>
          <Text style={styles.subtitle}>
            Installable builds, notification permissions, and launch assets are configured.
          </Text>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusBlock}>
            <Text style={styles.label}>Notifications</Text>
            <Text style={styles.value}>{permissionLabel}</Text>
          </View>
          <View style={styles.statusBlock}>
            <Text style={styles.label}>Build target</Text>
            <Text style={styles.value}>iOS</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test notifications</Text>
          <Text style={styles.body}>
            Local notifications work in development and standalone builds. Remote push
            notifications need Apple credentials during EAS build setup.
          </Text>
          <Pressable style={styles.primaryButton} onPress={scheduleLocalNotification}>
            <Text style={styles.primaryButtonText}>Send test notification</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={showToken}>
            <Text style={styles.secondaryButtonText}>Show push token</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last event</Text>
          <Text style={styles.body}>{lastNotification}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c1220',
  },
  container: {
    flexGrow: 1,
    gap: 22,
    padding: 24,
    paddingTop: 36,
  },
  header: {
    gap: 10,
    paddingTop: 18,
  },
  kicker: {
    color: '#f5c75c',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#b8c6cc',
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 360,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusBlock: {
    flex: 1,
    borderBottomColor: '#263443',
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  label: {
    color: '#8da0aa',
    fontSize: 13,
    marginBottom: 6,
  },
  value: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
  },
  section: {
    gap: 12,
    paddingTop: 8,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    color: '#b8c6cc',
    fontSize: 16,
    lineHeight: 24,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#f5c75c',
    borderRadius: 8,
    minHeight: 52,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#101827',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#314352',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
});
