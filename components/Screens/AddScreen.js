/* eslint-disable react/self-closing-comp */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext, createContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
// import * as ImagePicker from 'expo-image-picker';
import InputSpinner from 'react-native-input-spinner';
import ActionButton from 'react-native-action-button';

import ImagePicker from 'react-native-image-crop-picker';
import firebase from 'firebase';
import {AuthContext} from '../AuthProvider';

import {
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';

import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import InputScrollView from 'react-native-input-scroll-view';
import {Title} from 'react-native-paper';

export default function AddScreen({navigation, route}) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [genre, setGenre] = useState(null);
  const [summary, setSummary] = useState(null);
  const [price, setPrice] = useState(null);
  const [userData, setUserData] = useState(null);
  const user = firebase.auth().currentUser;

  // const user = firebase.auth().currentUser;
  const userId = firebase.auth().currentUser.uid;
  // const {user, logout} = useContext(AuthContext);
  // const user = route.params.userId;

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: false,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: false,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
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
    getUser();
  }, []);

  const userName = userData ? userData.name : 'Test';
  const submitBookPost = async () => {
    const imageUrl = await postBookImage();
    console.log('Image Url:', imageUrl);
    if (title == null || title == undefined || title.length < 3) {
      console.log('A INTRAT IN IF TITLU' + title);
      Alert.alert('Nu exista un titlu sau nu are cel putin 3 caractere');
    } else if (author == null || author == undefined || author.length < 3) {
      Alert.alert('Nu exista autor');
    } else if (genre == null || genre == undefined || genre.length < 3) {
      Alert.alert('Nu exista un gen literar');
    } else if (summary == null || summary == undefined || summary.length < 3) {
      Alert.alert('Nu exista o descriere');
    } else {
      console.log('TITLU' + title);
      firestore()
        .collection('user_book')
        .add({
          userId: userId,
          title: title,
          userName: userName,
          bookImg: imageUrl,
          postTime: firestore.Timestamp.fromDate(new Date()),
          author: author,
          genre: genre,
          summary: summary,
          price: price,
        })
        .then(() => {
          console.warn('Book Added!');
          Alert.alert(
            'Book published!',
            'Your book has been successfully added to Market!',
          );
          setTitle(null);
          setAuthor(null);
          setGenre(null);
          setSummary(null);
          setPrice(0);
        })
        .catch(error => {
          console.warn('Something went wrong.', error);
        });
    }
  };

  const postBookImage = async () => {
    if (image == null) {
      return null;
    }

    const uploadUri = image;

    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    try {
      await task;

      const url = storageRef.getDownloadURL();

      setUploading(false);
      // Alert.alert(
      //   'Image uploaded',
      //   'Your image has been uploaded to the Firebase Cloud Storage',
      // );
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }

    // setImage(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{paddingVertical: '2%'}}
        multiline
        numberOfLines={2}
        placeholder="Title"
        value={title}
        onChangeText={content => setTitle(content)}
      />

      <TextInput
        style={{paddingVertical: '2%'}}
        multiline
        placeholder="Author"
        value={author}
        onChangeText={content => setAuthor(content)}
      />

      <TextInput
        style={{paddingVertical: '2%'}}
        multiline
        numberOfLines={2}
        placeholder="Genre"
        value={genre}
        onChangeText={content => setGenre(content)}
      />

      {/* <View style={{borderBottomWidth: 5, borderBottomColor: 'white'}} /> */}
      <KeyboardAvoidingView>
        <TextInput
          style={{paddingVertical: '2%'}}
          multiline
          numberOfLines={2}
          placeholder="Description"
          value={summary}
          onChangeText={content => setSummary(content)}
        />
      </KeyboardAvoidingView>

      <InputSpinner
        placeholder={'Price'}
        value={price}
        onChange={num => setPrice(num)}></InputSpinner>
      <KeyboardAvoidingView style={{flexDirection: 'row', flex: 1}}>
        <View style={styles.imageView}>
          {image !== null ? (
            <Image style={styles.imageStyle} source={{uri: image}} />
          ) : null}
        </View>
        <View
          style={{
            marginTop: '40%',
            width: '15%',
            height: '20%',
          }}>
          <TouchableOpacity style={styles.btnStyle} onPress={submitBookPost}>
            <Icon
              name="add-circle-outline"
              // style={{backgroundColor: 'white'}}
              color={'black'}
              size={68}
            />
          </TouchableOpacity>
        </View>

        <ActionButton buttonColor="#8B0000">
          <ActionButton.Item
            buttonColor="white"
            title="Take a photo"
            style={{backgroundColor: 'white'}}
            onPress={takePhotoFromCamera}>
            <Icon
              name="camera-outline"
              // style={{backgroundColor: 'white'}}
              color={'#8B0000'}
              size={40}
            />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="white"
            title="Choose a photo from gallery"
            onPress={choosePhotoFromLibrary}>
            <Icon
              name="images-outline"
              style={styles.actionButtonIcon}
              color={'#8B0000'}
              size={40}
            />
          </ActionButton.Item>
        </ActionButton>
      </KeyboardAvoidingView>
      {/* <View style={styles.photoBtnView}> */}
      {/* <ScrollView>
        <TouchableOpacity style={styles.btnStyle} onPress={takePhotoFromCamera}>
          <Icon
            name="camera-outline"
            style={styles.actionButtonIcon}
            color={'#8B0000'}
            size={55}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={choosePhotoFromLibrary}>
          <Icon
            name="images-outline"
            style={styles.actionButtonIcon}
            color={'#8B0000'}
            size={55}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle}>
          <Icon
            name="search"
            style={styles.actionButtonIcon}
            color={'#8B0000'}
            size={55}
            onPress={submitBookPost}
          />
        </TouchableOpacity>
      </ScrollView> */}
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: '100%',
  },

  photoBtnView: {
    marginTop: '3%',
    flexDirection: 'row',
    alignSelf: 'center',
  },

  inputText: {
    width: '100%',
    height: '7%',
    fontSize: 12,
    borderWidth: 1,
  },

  btnStyle: {
    width: '100%',
    height: '100%',
  },
  imageView: {
    width: '78%',
    marginTop: '2%',
    height: '95%',
    backgroundColor: '#2e64e515',

    borderWidth: 1,
  },
  inputTextSummary: {
    width: '100%',
    height: '8%',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  viewBtnPost: {
    backgroundColor: 'brown',
    alignSelf: 'center',
    paddingVertical: '1%',
    paddingHorizontal: '1%',
    borderRadius: 20,
    marginTop: '10%',
    width: 100,
    height: 100,
  },
  txt: {
    width: '20%',
    marginTop: '1%',
    marginLeft: '4%',
    color: 'white',
    fontSize: 20,
  },
});
