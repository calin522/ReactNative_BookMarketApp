/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import firebase from 'firebase';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../AuthProvider';

const onLogout = () => {
  firebase.auth().signOut();
};

export default function ProfileScreen({navigation, route}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const user = firebase.auth().currentUser;
  const userIdd = firebase.auth().currentUser.uid;

  const fetchBook = async () => {
    try {
      const list = [];
      await firestore()
        .collection('user_book')
        .where('userId', '==', userIdd)
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

  const onRefresh = () => {
    setTimeout(() => {
      fetchBook();
    }, 1000);
  };

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
    navigation.addListener('focus', () => setLoading(!loading));
    getUser();
    fetchBook();
    setDeleted(false);
  }, [deleted, navigation, loading]);

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

  // const ItemSeparatorView = () => {
  //   return (
  //     <View style={{height: 2, width: '100%', backgroundColor: 'black'}}></View>
  //   );
  // };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}></RefreshControl>
        }
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.userImg}
          source={{
            uri: userData
              ? userData.userImg
              : 'https://www.google.com/search?q=image&sxsrf=ALeKk02EvRLm_BShFSYeEjcNZtSgDQleBg:1618672806523&tbm=isch&source=iu&ictx=1&fir=sp12V8x9gw6KuM%252C4O2GvGuD-Cf09M%252C_&vet=1&usg=AI4_-kQEhwvv8XVOUM-Brg35qlp5X-Ofxw&sa=X&ved=2ahUKEwiyq4-NyoXwAhUFhf0HHYTEC5sQ9QF6BAgREAE#imgrc=sp12V8x9gw6KuM',
          }}></Image>
        <Text style={styles.userName}>{userData ? userData.name : 'Test'}</Text>

        <Text style={styles.aboutUser}>
          {' '}
          {userData ? userData.about || 'No details added' : ''}
        </Text>

        <View style={styles.userBtnWrapper}>
          <TouchableOpacity
            style={styles.userBtn}
            onPress={() => navigation.navigate('Messages')}>
            <Text style={styles.userBtnTxt}>My messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userBtn}
            onPress={() => {
              navigation.navigate('EditProfile');
            }}>
            <Text style={styles.userBtnTxt}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userBtn} onPress={() => onLogout()}>
            <Text style={styles.userBtnTxt}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}></Text>
            <Text style={styles.userInfoSubTitle}>{books.length} Books</Text>
          </View>
        </View>

        {books.map(item => (
          <TouchableOpacity
            style={styles.bookFeed}
            onPress={() => navigation.navigate('UserBook', {item})}>
            <View style={styles.textViewStyle}>
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
                Price:
                <Text style={{color: 'black', fontStyle: 'normal'}}>
                  {item.price} lei
                </Text>
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text>{moment(item.postTime.toDate()).fromNow()}</Text>
                {user.uid === item.userId ? (
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Icon
                      name="trash"
                      color={'#DC143C'}
                      size={30}
                      style={{marginLeft: '20%'}}
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
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#8B0000',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#8B0000',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  book: {
    flex: 1,
    width: '100%',
  },
  bookFeed: {
    flexDirection: 'row-reverse',
    width: '100%',
    height: 200,
    marginBottom: '10%',
    backgroundColor: 'white',

    borderWidth: 1,
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
    color: 'black',
  },
  txtUser: {
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: 'blue',
    flexDirection: 'column',
  },
  textInput: {
    backgroundColor: 'white',
  },
});
