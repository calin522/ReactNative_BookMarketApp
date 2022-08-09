/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-dupe-keys */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
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

import firebase from 'firebase';

export class Login extends Component {
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
    const {email, password} = this.state;
    if (email === '') {
      this.setState(Alert.alert('Adresa de e-mail nu a fost introdusa'));
    } else if (password === '') {
      this.setState(Alert.alert('Parola nu a fost introdusa'));
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(result => {
          console.log(result);
        })
        .catch(error =>
          Alert.alert('Adresa de e-mail sau parola nu sunt corecte'),
        );
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../../assets/login.jpg')}
        style={styles.background}>
        <View style={styles.header}></View>
        <View style={styles.footer}>
          <ScrollView>
            <Text style={styles.text_footer}>E-mail</Text>
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
                <Text style={styles.signUpText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

export default Login;

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
