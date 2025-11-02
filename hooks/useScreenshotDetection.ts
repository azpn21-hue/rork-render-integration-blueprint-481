import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
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
            console.log('[ScreenshotDetection] Screenshot detected!');
            
            // Log the capture event
            addCaptureEvent({
              screen: screenName,
              timestamp: new Date().toISOString(),
              status: 'recorded',
            });

            // Show alert to user
            if (showAlert) {
              Alert.alert(
                'Screenshot Detected',
                'This content is protected. The screenshot has been logged.',
                [{ text: 'OK' }]
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
            console.log('[ScreenshotDetection] Screenshot shortcut detected on web');
            
            addCaptureEvent({
              screen: screenName,
              timestamp: new Date().toISOString(),
              status: 'recorded',
            });

            if (showAlert) {
              alert('Screenshot attempt detected. This content is protected and has been logged.');
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
