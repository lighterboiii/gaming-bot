import { postEvent } from "@tma.js/sdk";

interface HapticFeedbackConfig {
  enabled: boolean;
  // devMode: boolean;
}

const config: HapticFeedbackConfig = {
  enabled: process.env.REACT_APP_ENABLE_HAPTIC === 'true',
  // devMode: isDevelopment
};

export const setHapticFeedbackEnabled = (enabled: boolean) => {
  config.enabled = enabled;
};

// export const setHapticFeedbackDevMode = (devMode: boolean) => {
//   config.devMode = devMode;
// };

export const triggerHapticFeedback = 
(type: 'impact' | 'notification', style?: 'light' | 'soft' | 'heavy' | 'success' | 'error') => {
  if (process.env.REACT_APP_ENABLE_HAPTIC !== 'true') return;
  
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
};

export const getHapticConfig = () => ({
  ...config
}); 