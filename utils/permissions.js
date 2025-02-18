import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermissions = async () => {
  try {
    const permissions = [];

    if (Platform.OS === 'android') {
      permissions.push(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissions.push(PERMISSIONS.ANDROID.CHANGE_WIFI_STATE);
      permissions.push(PERMISSIONS.ANDROID.ACCESS_WIFI_STATE);
      permissions.push(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
    } else if (Platform.OS === 'ios') {
      permissions.push(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }

    for (const permission of permissions) {
      const result = await request(permission);
      if (result !== RESULTS.GRANTED) {
        console.warn(`Permission ${permission} not granted!`);
      }
    }
  } catch (error) {
    console.error('Permission request error:', error);
  }
};
