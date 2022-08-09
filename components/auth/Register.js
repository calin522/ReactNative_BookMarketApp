import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {render} from 'react-dom';

import firebase from 'firebase';
import firestore from '@react-native-firebase/firestore';

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: '',
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const {email, password, name} = this.state;
    if (name === '') {
      this.setState(Alert.alert('Nu ati introdus un nume!'));
    } else if (name.length < 4) {
      this.setState(
        Alert.alert('Numele trebuie sa fie format din cel putin 4 caractere!'),
      );
    } else if (password === '') {
      this.setState(Alert.alert('Nu ati introdus o parola!'));
    } else if (password.length < 6) {
      this.setState(
        Alert.alert('Parola trebuie sa contian cel putin 6 caractere!'),
      );
    } else if (email === '') {
      Alert.alert('Nu ati introdus o adresa de e-mail!');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          firestore()
            .collection('user')
            .doc(firebase.auth().currentUser.uid)
            .set({
              name,
              email,
              createdAt: firestore.Timestamp.fromDate(new Date()),
              userImg: null,
            });
          Alert.alert('Contul dumneavoastra a fost creat cu succes!');
        })
        .catch(error => {
          Alert.alert(
            'Adresa de e-mail nu esta scrisa corect sau exista deja!',
          );
        });
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../../assets/login.jpg')}
        style={styles.background}>
        <View style={styles.header}></View>
        <View style={styles.footer}>
          <ScrollView persistentScrollbar={true}>
            <Text style={styles.text_footer}>Name</Text>
            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#8B0000"
                size={20}></FontAwesome>
              <TextInput
                style={styles.textInput}
                placeholder="Your Name"
                onChangeText={name => this.setState({name})}
              />
            </View>

            <Text style={[styles.text_footer, {marginTop: 35}]}>E-mail</Text>
            <View style={styles.action}>
              <FontAwesome
                name="envelope"
                color="#8B0000"
                size={20}></FontAwesome>
              <TextInput
                style={styles.textInput}
                placeholder="Your E-mail"
                onChangeText={email => this.setState({email})}
              />
            </View>
            <Text style={[styles.text_footer, {marginTop: 35}]}>Password</Text>
            <View style={styles.action}>
              <Feather name="lock" color="#8B0000" size={20}></Feather>
              <TextInput
                style={styles.textInput}
                placeholder="Your Password"
                secureTextEntry={true}
                onChangeText={password => this.setState({password})}
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.singUpStyle}
                onPress={() => this.onSignUp()}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffe0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a',
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  singUpStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    alignSelf: 'center',
    marginTop: '20%',
    width: 170,
    height: 45,
    borderRadius: 20,
    borderColor: '#000000',
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  text_footer: {
    color: '#8B0000',
    fontSize: 18,
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textStyle: {
    fontSize: 25,
  },
});
