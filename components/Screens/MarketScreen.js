/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

import {SearchBar} from 'react-native-elements';
import {withRepeat} from 'react-native-reanimated';

export default function MarketScreen({navigation, route}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleted, setDeleted] = useState(false);
  const user = firebase.auth().currentUser;
  const [refreshing, setRefreshing] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');

  // const userId = firebase.auth().currentUser.uid;
  const [userData, setUserData] = useState(null);

  const fetchBook = async () => {
    try {
      const list = [];

      await firestore()
        .collection('user_book')
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total books from users', querySnapshot.size);
          querySnapshot.forEach(doc => {
            const {
              userId,
              title,
              bookImg,
              postTime,
              author,
              genre,
              summary,
              price,
              userName,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              title,
              bookImg,
              postTime: postTime,
              author,
              genre,
              summary,
              price,
              userName,
            });
          });
        });
      setBooks(list);
      if (loading) {
        setLoading(false);
      }

      console.log('Books', list);
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async () => {
    const currentUser = await firestore()
      .collection('user')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
    console.log('afasf', userData);
  };

  useEffect(() => {
    getUser();
    fetchBook();
    setFilteredDataSource(books);
    setMasterDataSource(books);
    setDeleted(false);
    setLoading(false);
  }, [deleted]);

  const deleteBook = bookId => {
    console.log(bookId);

    firestore()
      .collection('user_book')
      .doc(bookId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {bookImg} = documentSnapshot.data();

          if (bookImg !== null) {
            const sotageRef = storage().refFromURL(bookImg);
            const imageRef = storage().ref(sotageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log('${bookImg} has been deleted');
                deleteFirestoreData(bookId);
                setDeleted(true);
              })
              .catch(e => {
                console.log('Error while deleting the image', e);
              });
          } else {
            deleteFirestoreData(bookId);
          }
        }
      });
  };

  const handleDelete = bookId => {
    Alert.alert('Delete Book', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () => deleteBook(bookId)},
    ]);
  };

  const deleteFirestoreData = bookId => {
    firestore()
      .collection('user_book')
      .doc(bookId)
      .delete()
      .then(() => {
        Alert.alert('Your book was deleted from MarketStore');
      })
      .catch(e => console.log('Error deleting book', e));
  };

  const ItemSeparatorView = () => {
    return (
      <View style={{height: 1, width: '100%', backgroundColor: 'black'}}></View>
    );
  };

  const searchFilterFunction = (text1, filter1 = 'title') => {
    if (text1) {
      const newData = masterDataSource.filter(function (item) {
        const itemDataTitle = item
          ? item[filter1].toUpperCase()
          : ''.toUpperCase();
        const textData = text1.toUpperCase();
        return itemDataTitle.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text1);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        round
        searchIcon={{size: 35}}
        style={styles.textInput}
        onChangeText={text => searchFilterFunction(text)}
        onClear={text => searchFilterFunction('')}
        placeholder="Type Here..."
        value={search}
        color="black"
      />
      <FlatList
        // onRefresh={() => fetchBook()}
        data={filteredDataSource}
        refreshing={loading}
        extraData={query}
        ItemSeparatorView={ItemSeparatorView}
        keyExtractor={(index, item) => item.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.bookFeed}
            onPress={() => navigation.navigate('UserBook', {item})}>
            <View style={styles.textViewStyle}>
              <Text style={styles.txt1}>
                Posted by:
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Profile', {userId: item.userId})
                  }>
                  <Text style={styles.txtUser}>{item.userName}</Text>
                </TouchableOpacity>
              </Text>

              <Text style={styles.txt1}>
                Title:
                <Text style={styles.txt2}>{item.title}</Text>
              </Text>
              <Text style={styles.txt1}>
                Author:<Text style={styles.txt2}>{item.author}</Text>
              </Text>
              <Text style={styles.txt1}>
                Genre:<Text style={styles.txt2}>{item.genre}</Text>
              </Text>
              <Text style={styles.txt1}>
                Price:<Text>{item.price} lei</Text>
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text>{moment(item.postTime.toDate()).fromNow()}</Text>
                {user.uid === item.userId ? (
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={{marginLeft: '20%'}}>
                    <Icon
                      name="trash"
                      color={'#DC143C'}
                      size={30}
                      style={{marginTop: -10}}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <View style={styles.book}>
              {item.bookImg !== null ? (
                <Image
                  style={styles.bookImage}
                  source={{
                    uri: item.bookImg,
                  }}></Image>
              ) : (
                <Text>SFSAFAS</Text>
              )}
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

  book: {
    flex: 1,
    width: '100%',
  },
  bookFeed: {
    flexDirection: 'row-reverse',
    width: '100%',
    marginBottom: '5%',
    height: 250,

    backgroundColor: 'white',

    borderWidth: 1,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
  bookTxt: {
    marginLeft: 200,
  },
  bookView: {
    flex: 1,
    width: '50%',
    height: '100%',
    padding: 1,
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  bookTitleText: {
    color: '#8B0000',
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  textViewStyle: {
    marginTop: '1%',
    marginLeft: '1%',
    borderRadius: 20,
    width: '50%',
  },
  bookAuthor: {
    color: '#F41313',
  },
  txt1: {
    padding: 5,
    fontSize: 15,
    color: '#8B0000',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  txt2: {
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  txtUser: {
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: 'blue',
    flexDirection: 'column',
  },
});
