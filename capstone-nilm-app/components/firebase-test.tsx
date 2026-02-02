import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export function FirebaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      // Try to fetch users collection
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      setStatus('success');
      setMessage(`✅ Firebase connected! Found ${snapshot.size} users.`);
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Firebase error: ${error?.message || 'Unknown error'}`);
      console.error('Firebase connection error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {status === 'loading' && <ActivityIndicator size="large" />}
      <Text style={[
        styles.message,
        status === 'success' ? styles.success : styles.error
      ]}>
        {message || 'Testing Firebase connection...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});