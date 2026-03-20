import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GreetingProps {
  name: string;
}

export function Greeting({ name }: GreetingProps) {
  return (
    <View style={styles.container}>
      <Text testID="greeting" style={styles.text}>Hello, {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  text: { fontSize: 24 },
});
