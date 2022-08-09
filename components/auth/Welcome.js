import React, {useContext, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import BookScreen from '../Screens/BookScreen';

export default function Welcome({navigation}) {
  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      style={styles.background}>
      <View style={styles.header}></View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginBtn}
          // onPress={() => console.log("Login works")}
        >
          <Text style={styles.textLogin}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.singupBtn}
          // onPress={() => console.log("SignUp works")}
        >
          <Text style={styles.textSignUp}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginTop: '40%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  textTitle: {
    position: 'absolute',
    marginTop: 100,
    alignSelf: 'center',

    color: '#A0522D',
    fontSize: 40,
  },
  textLogin: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  textSignUp: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  backGroundImage: {
    width: '100%',
    height: '100%',
  },
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    alignSelf: 'center',
    marginTop: '10%',
    width: 170,
    height: 45,
    borderRadius: 20,
    borderColor: '#000000',
  },
  singupBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#8B0000',
    marginTop: '5%',
    width: 170,
    height: 45,
    borderRadius: 20,
    borderColor: '#000000',
  },
});
