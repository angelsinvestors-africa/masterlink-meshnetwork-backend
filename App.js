import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import PaymentScreen from './components/PaymentScreen';
import Dashboard from './components/Dashboard';
import { checkPaymentStatus } from './utils/api';
import { requestPermissions } from './utils/permissions';

const App = () => {
  // Utambuzi wa kifaa: kama device ni primaryNode, basi haitahitaji malipo
  const [deviceId, setDeviceId] = useState('device123');
  const [paymentStatus, setPaymentStatus] = useState('PENDING');

  useEffect(() => {
    requestPermissions();

    if (deviceId === 'primaryNode') {
      setPaymentStatus('SUCCESS');
    } else {
      pollPaymentStatus();
    }
  }, []);

  const pollPaymentStatus = () => {
    const interval = setInterval(async () => {
      try {
        const response = await checkPaymentStatus(deviceId);
        if (response.paymentStatus === 'SUCCESS') {
          setPaymentStatus('SUCCESS');
          clearInterval(interval);
          Alert.alert('Payment Verified', 'Access granted to the internet.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);
  };

  return (
    <View style={styles.container}>
      {paymentStatus === 'SUCCESS' ? (
        <Dashboard deviceId={deviceId} />
      ) : (
        <PaymentScreen deviceId={deviceId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff'
  }
});

export default App;
