import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

export default function MyBooks() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>MY BOOKS</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '100%',
  },
});
