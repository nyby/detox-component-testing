import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StepperProps {
  initial?: number;
  onChange?: (value: number) => void;
}

export function Stepper({ initial = 0, onChange }: StepperProps) {
  const [count, setCount] = useState(initial);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    onChange?.(next);
  };

  const decrement = () => {
    const next = count - 1;
    setCount(next);
    onChange?.(next);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity testID="decrement" onPress={decrement} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text testID="counter" style={styles.counter}>{count}</Text>
      <TouchableOpacity testID="increment" onPress={increment} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 },
  button: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ddd', borderRadius: 8 },
  buttonText: { fontSize: 24 },
  counter: { fontSize: 24, marginHorizontal: 20 },
});
