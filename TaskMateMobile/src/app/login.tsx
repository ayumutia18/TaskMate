import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email.trim() || !password) {
      Alert.alert('Data belum lengkap', 'Isi email dan password terlebih dahulu.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password terlalu pendek', 'Gunakan minimal 6 karakter.');
      return;
    }

    setLoading(true);

try {
  if (isRegister) {
    await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  } else {
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  }

  router.replace('/');
} catch (error: any) {
  Alert.alert(
    'Gagal',
    error.code === 'auth/email-already-in-use'
      ? 'Email sudah terdaftar. Silakan login.'
      : error.code === 'auth/invalid-credential'
      ? 'Email atau password salah.'
      : error.message || 'Terjadi kesalahan.'
  );
} finally {
  setLoading(false);
}
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TaskMate</Text>
      <Text style={styles.subtitle}>
        {isRegister ? 'Buat akun mahasiswa baru' : 'Selamat datang kembali!'}
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="nama@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Minimal 6 karakter"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isRegister ? 'Daftar Akun' : 'Login'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsRegister(!isRegister)}
      >
        <Text style={styles.switchText}>
          {isRegister
            ? 'Sudah punya akun? Login'
            : 'Belum punya akun? Daftar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#F5F7FC',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2449A8',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#68758F',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 35,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24345C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3F0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#2449A8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 22,
    alignItems: 'center',
  },
  switchText: {
    color: '#2449A8',
    fontWeight: '600',
  },
});