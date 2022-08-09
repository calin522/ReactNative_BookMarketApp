/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
export default function BookScreen({navigation, route}) {
  return (
    // console.log(route.params.item),
    <ScrollView style={styles.container}>
      {/* <ImageBackground
        source={{uri: route.params.item.bookImg}}
        style={styles.bookImageBackground}
        blurRadius={1}> */}
      <View style={styles.bookImageBackground}>
        <Image
          source={{uri: route.params.item.bookImg}}
          style={styles.bookImage}></Image>
      </View>

      {/* </ImageBackground> */}
      <View style={styles.line} />

      <Text style={styles.bookTitle}>
        <Text style={styles.titluText}>Title: </Text>
        {route.params.item.title}
      </Text>
      <View style={styles.line} />
      <Text style={styles.bookAuthor}>
        <Text style={styles.titluText}>Author: </Text>
        {route.params.item.author}
      </Text>
      <View style={styles.line} />

      <Text style={styles.bookGenre}>
        <Text style={styles.titluText}>Genre: </Text>
        {route.params.item.genre}
      </Text>
      <View style={styles.line} />

      <Text style={styles.bookDescription}>
        <Text style={styles.descriptionText}>Description: </Text>
        {route.params.item.summary}
      </Text>
      <View style={styles.line} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookImageBackground: {
    width: '100%',
  },
  titluText: {
    fontSize: 20,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold',
  },

  bookImage: {
    paddingVertical: '50%',
    paddingHorizontal: '10%',
  },
  bookTitle: {
    marginTop: '5%',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  bookAuthor: {
    marginTop: '5%',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B63333',
  },
  line: {
    borderBottomColor: 'black',
    marginTop: '5%',
    borderBottomWidth: 1,
  },
  bookDescription: {
    fontSize: 16,
    color: 'black',
    fontStyle: 'normal',
  },
  descriptionText: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  bookGenre: {
    marginTop: '5%',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B63333',
  },
});
