import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, NativeModules } from 'react-native';
import { optimizeConnections } from '../utils/network';

const Dashboard = ({ deviceId }) => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android' && NativeModules.WiFiDirectModule) {
      NativeModules.WiFiDirectModule.getActiveConnections((error, result) => {
        if (!error) {
          const parsed = JSON.parse(result);
          const optimized = optimizeConnections(parsed);
          setConnections(optimized);
        }
      });
    } else if (Platform.OS === 'ios' && NativeModules.MultipeerModule) {
      NativeModules.MultipeerModule.getConnectedPeers((error, result) => {
        if (!error) {
          const parsed = JSON.parse(result);
          const optimized = optimizeConnections(parsed);
          setConnections(optimized);
        }
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mesh Network Dashboard</Text>
      <Text style={styles.subtitle}>Active Connections:</Text>
      {connections.length > 0 ? (
        connections.map((conn) => (
          <Text key={conn.id} style={styles.connection}>
            {conn.name} - Signal: {conn.signalStrength}
          </Text>
        ))
      ) : (
        <Text style={styles.connection}>No active connections detected.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 15
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10
  },
  connection: {
    fontSize: 16,
    marginBottom: 5
  }
});

export default Dashboard;
