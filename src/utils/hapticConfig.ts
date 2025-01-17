import { postEvent } from "@tma.js/sdk";

interface HapticFeedbackConfig {
  enabled: boolean;
  devMode: boolean;
}

// Check if we're in Telegram WebApp environment
// const isTelegramWebApp = Boolean((window as any).Telegram?.WebApp);

const config: HapticFeedbackConfig = {
  enabled: process.env.REACT_APP_ENABLE_HAPTIC === 'true',
  // && isTelegramWebApp,
  devMode: process.env.NODE_ENV === 'development'
};

export const setHapticFeedbackEnabled = (enabled: boolean) => {
  config.enabled = enabled
  //  && isTelegramWebApp;
};

export const setHapticFeedbackDevMode = (devMode: boolean) => {
  config.devMode = devMode;
};

export const triggerHapticFeedback = 
(type: 'impact' | 'notification', style?: 'light' | 'soft' | 'heavy' | 'success' | 'error') => {
  if (!config.enabled 
    // || !isTelegramWebApp
  )
     return;
  
  try {
    if (type === 'impact') {
      postEvent('web_app_trigger_haptic_feedback', {
        type: 'impact',
        impact_style: style as 'light' | 'soft' | 'heavy'
      });
    } else if (type === 'notification') {
      postEvent('web_app_trigger_haptic_feedback', {
        type: 'notification',
        notification_type: style as 'success' | 'error'
      });
    }
  } catch (error) {
    if (config.devMode) {
      console.warn('Failed to trigger haptic feedback:', error);
    }
  }
};

export const getHapticConfig = () => ({
  ...config,
  // isTelegramWebApp
}); 