import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ListView from './Component/screens/listview';
import HomeMenu from './Component/screens/homemenu';
import Home from './Component/screens/home';
import Login from './Component/screens/login';
import Signup from './Component/screens/signup';
import Logout from './Component/screens/logout';
import Account from './Component/screens/account';
import Location from './Component/screens/location';
import Review from './Component/screens/review';
import AboutUs from './Component/screens/aboutus';
import MyReviews from './Component/screens/myreviews';
import FavouriteCafes from './Component/screens/favouritecafes';
import UpdateReview from './Component/screens/updatereview';

const Stack = createStackNavigator();

export default function Screens() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="HomeMenu" component={HomeMenu} options={{headerShown: false}} />
            <Stack.Screen name="Home" component={Home} options={{headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 139 }, headerLeft: null}}  />
            <Stack.Screen name="ListView" component={ListView} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 70 }, title: 'List View' }} />
            <Stack.Screen name="Login" component={Login}   options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 76 }}}  />
            <Stack.Screen name="Signup" component={Signup}  options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 76 }, title: 'Sign Up'}} />
            <Stack.Screen name="Logout" component={Logout} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 82 }, title: 'Menu' }} />
            <Stack.Screen name="Account" component={Account} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 71 }}} />
            <Stack.Screen name="Location" component={Location} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 88 }, title: 'Cafe' }} />
            <Stack.Screen name="Review" component={Review} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 76 }}} />
            <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 65 }, title: 'About Us' }} />
            <Stack.Screen name="MyReviews" component={MyReviews} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 54 }, title: 'My Reviews' }} />
            <Stack.Screen name="FavouriteCafes" component={FavouriteCafes} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 38 }, title: 'Favourite Cafes' }} />
            <Stack.Screen name="UpdateReview" component={UpdateReview} options={{ headerStyle: {backgroundColor: 'rgba(248, 114, 23, 0.8)'},headerTitleStyle: {  left: 48 },title: 'Update Review' }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

