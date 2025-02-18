import React from 'react';
import { View, Text, Button, Linking, StyleSheet } from 'react-native';

const CLICKPESA_URL = 'https://checkout.clickpesa.com/payment-page?ref=PYP7677960';

const PaymentScreen = ({ deviceId }) => {
  const openPaymentPage = async () => {
    const supported = await Linking.canOpenURL(CLICKPESA_URL);
    if (supported) {
      Linking.openURL(CLICKPESA_URL);
    } else {
      alert('Cannot open payment URL.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access Internet via Mesh Network</Text>
      <Text style={styles.subtitle}>Pay Tsh 1,000 for 1GB per day for 7 days</Text>
      <Button title="Pay with ClickPesa" onPress={openPaymentPage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 22,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  }
});

export default PaymentScreen;
