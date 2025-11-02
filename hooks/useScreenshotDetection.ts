import { useEffect } from 'react';
import { Platform, Alert, Vibration } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import * as Haptics from 'expo-haptics';
import { useR3al } from '@/app/contexts/R3alContext';

interface UseScreenshotDetectionOptions {
  screenName: string;
  enabled?: boolean;
  showAlert?: boolean;
  preventCapture?: boolean;
}

export function useScreenshotDetection({
  screenName,
  enabled = true,
  showAlert = true,
  preventCapture = false,
}: UseScreenshotDetectionOptions) {
  const { addCaptureEvent } = useR3al();

  useEffect(() => {
    if (!enabled) return;

    let subscription: any = null;

    const setupDetection = async () => {
      console.log(`[ScreenshotDetection] Setting up for screen: ${screenName}`);

      // Prevent screenshots if requested (mobile only)
      if (preventCapture && Platform.OS !== 'web') {
        try {
          await ScreenCapture.preventScreenCaptureAsync();
          console.log('[ScreenshotDetection] Screenshot prevention enabled');
        } catch (error) {
          console.error('[ScreenshotDetection] Failed to prevent screenshots:', error);
        }
      }

      // Add screenshot detection listener (mobile only)
      if (Platform.OS !== 'web') {
        try {
          subscription = ScreenCapture.addScreenshotListener(() => {
            console.log('🚨 [ScreenshotDetection] Screenshot detected!');
            
            // Haptic feedback - strong warning pattern
            if (Platform.OS === 'ios') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } else {
              // Android vibration pattern: [wait, vibrate, wait, vibrate]
              Vibration.vibrate([0, 200, 100, 200]);
            }

            // Log the capture event
            addCaptureEvent({
              screen: screenName,
              timestamp: new Date().toISOString(),
              status: 'recorded',
            });

            // Show alert to user with enhanced messaging
            if (showAlert) {
              Alert.alert(
                '🛡️ Privacy Shield Triggered',
                `Screenshot detected on ${screenName.replace(/_/g, ' ')}\n\nThis content is protected. The capture has been logged and the content owner has been notified.\n\nRepeated violations may result in account restrictions.`,
                [
                  { 
                    text: 'I Understand',
                    style: 'cancel'
                  },
                  {
                    text: 'View History',
                    onPress: () => {
                      console.log('[ScreenshotDetection] User wants to view history');
                    }
                  }
                ],
                { cancelable: false }
              );
            }
          });
          console.log('[ScreenshotDetection] Listener added successfully');
        } catch (error) {
          console.error('[ScreenshotDetection] Failed to add listener:', error);
        }
      } else {
        // Web fallback - detect keyboard shortcuts
        const handleKeyDown = (event: KeyboardEvent) => {
          // Detect common screenshot shortcuts
          const isPrintScreen = event.key === 'PrintScreen';
          const isWindowsSnip = event.key === 's' && event.shiftKey && event.metaKey;
          const isMacScreenshot = 
            (event.key === '3' || event.key === '4' || event.key === '5') && 
            event.shiftKey && 
            event.metaKey;

          if (isPrintScreen || isWindowsSnip || isMacScreenshot) {
            console.log('🚨 [ScreenshotDetection] Screenshot shortcut detected on web');
            
            addCaptureEvent({
              screen: screenName,
              timestamp: new Date().toISOString(),
              status: 'recorded',
            });

            if (showAlert) {
              alert(
                '🛡️ Privacy Shield Triggered\n\n' +
                `Screenshot attempt detected on ${screenName.replace(/_/g, ' ')}\n\n` +
                'This content is protected. The capture has been logged and the content owner has been notified.\n\n' +
                'Repeated violations may result in account restrictions.'
              );
            }
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        console.log('[ScreenshotDetection] Web keyboard listener added');

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }
    };

    setupDetection();

    return () => {
      // Cleanup mobile listener
      if (subscription) {
        subscription.remove();
        console.log('[ScreenshotDetection] Listener removed');
      }

      // Re-allow screenshots if they were prevented
      if (preventCapture && Platform.OS !== 'web') {
        ScreenCapture.allowScreenCaptureAsync().catch((error) =>
          console.error('[ScreenshotDetection] Failed to re-allow screenshots:', error)
        );
      }
    };
  }, [enabled, screenName, showAlert, preventCapture, addCaptureEvent]);
}
