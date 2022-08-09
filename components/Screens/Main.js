/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ExploreScreen from './ExploreScreen';
import AddScreen from './AddScreen';
import ProfileScreen from './ProfileScreen';
import MyBooks from './MyBooks';
import MarketScreen from './MarketScreen';
import HomeProfile from './HomeProfile';

const Tab = createMaterialBottomTabNavigator();

export default function Main() {
  return (
    <Tab.Navigator
      initialRouteName="Explore"
      activeColor="#8B0000"
      inactiveColor="#808080"
      barStyle={{backgroundColor: '#FFFFFF'}}>
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          showIcon: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="book-search-outline"
              color={color}
              size={26}
            />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          showIcon: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="shopping-search"
              color={color}
              size={26}
            />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          showIcon: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="MyBooks"
        component={MyBooks}
        options={{
          showIcon: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bookshelf" color={color} size={26} />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="HomeProfile"
        component={HomeProfile}
        options={{
          showIcon: true,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            />
          ),
        }}></Tab.Screen>
    </Tab.Navigator>
  );
}
