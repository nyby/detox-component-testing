import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface LoginFormProps {
  onSubmit?: (credentials: { username: string; password: string }) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    setError('');
    onSubmit?.({ username, password });
  };

  return (
    <View style={styles.container}>
      <TextInput
        testID="username"
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        testID="password"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text testID="error" style={styles.error}>{error}</Text> : null}
      <TouchableOpacity testID="submit" onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { height: 44, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  button: { height: 44, backgroundColor: '#007AFF', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: 'red', marginBottom: 12 },
});
