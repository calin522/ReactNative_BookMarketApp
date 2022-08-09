/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import SafeAreaView from 'react-native-safe-area-view';

export default function MessageScreen({navigation}) {
  const Messages = [
    {
      id: 1,
      userName: "Andrei Golanu'",
      messageTime: '4 mins ago',
      messageText: 'Salut! Sunt interesat de cartea ta!',
    },
    {
      id: 2,
      userName: "Maria Golanca'",
      messageTime: '7 mins ago',
      messageText: 'Hei! Sunt interesat de cartea ta!',
    },
    {
      id: 3,
      userName: "Gigel Nebunu'",
      messageTime: '2 mins ago',
      messageText: 'Salutare! Sunt interesat de cartea ta!',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            // onPress={() =>
            //   navigation.navigate('Chat', {userName: item.userName})
            // }
          >
            <View style={styles.userInfo}>
              <View style={styles.userImgWrapper}>
                <Image
                  style={styles.userImg}
                  source={{
                    uri:
                      'https://images.generated.photos/a_bA_5ZrKgXyjs4LR6IFcnrt88isnCnk1guSRntRyJg/rs:fit:256:256/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA4MTI5MjUuanBn.jpg',
                  }}></Image>
                <View style={styles.textSection}>
                  <View style={styles.userInfotText}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.postTime}>{item.messageTime}</Text>
                  </View>
                  <Text style={styles.messageText}>{item.messageText}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 350,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  userInfotText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
  },
  postTime: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Lato-Regular',
  },
  messageText: {
    fontSize: 14,
    color: 'brown',
  },
});
