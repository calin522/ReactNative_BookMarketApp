/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import firestore from '@react-native-firebase/firestore';

export default function ChatScreen({route, navigation}) {
  const user = route.params.userId;
  const [userData, setUserData] = useState(null);
  const getUser = async () => {
    await firestore()
      .collection('user')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{route.params.userName}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '100%',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
