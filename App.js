/* eslint-disable react/self-closing-comp */
import React, {Component} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDLt8A24YZ5aNPeeuW61mjw20F20YrYaos',
  authDomain: 'licenta-ardeleanucalin.firebaseapp.com',
  projectId: 'licenta-ardeleanucalin',
  storageBucket: 'licenta-ardeleanucalin.appspot.com',
  messagingSenderId: '648686977820',
  appId: '1:648686977820:web:d4613fdbc6125b34ea30d9',
  measurementId: 'G-VQ6STVH5MC',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const projectStorage = firebase.storage();

export {projectStorage};

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from './components/auth/Welcome';
import {Register} from './components/auth/Register';
import AddScreen from './components/Screens/AddScreen';
import Login from './components/auth/Login';
import Main from './components/Screens/Main';
import BookScreen from './components/Screens/BookScreen';
import ExploreScreen from './components/Screens/MyBooks';
import ProfileScreen from './components/Screens/ProfileScreen';
import EditProfileScreen from './components/Screens/EditProfileScreen';
import MarketScreen from './components/Screens/MarketScreen';
import User_Book_Screen from './components/Screens/User_Book_Screen';
import MessageScreen from './components/Screens/MessageScreen';
import ChatScreen from './components/Screens/ChatScreen';
// import HomeProfile from './components/Screens/HomeProfile';

import AuthContext from './components/AuthProvider';

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }
  render() {
    const {loggedIn, loaded} = this.state;
    if (!loaded) {
      return (
        <View style={styles.loading}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Register"
              component={Register}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={Main}
            options={{headerShown: false}}></Stack.Screen>
          <Stack.Screen
            name="Add"
            component={AddScreen}
            options={{headerShown: false}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="Explore"
            component={ExploreScreen}
            options={{headerShown: false}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="Book"
            component={BookScreen}
            options={{headerShown: false}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{headerShown: false}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{headerShown: false}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="Market"
            component={MarketScreen}
            options={{headerShown: false}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="UserBook"
            component={User_Book_Screen}
            options={{headerShown: false}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="Messages"
            component={MessageScreen}
            options={{headerShown: true}}
            navigation={this.props.navigation}></Stack.Screen>
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            // options={({route}) => ({title: route.params.userName})}
            navigation={this.props.navigation}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
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

export default App;
