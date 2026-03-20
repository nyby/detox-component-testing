import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export function ShowError() {
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
