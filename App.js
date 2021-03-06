import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ListView from './screens/listview';
import HomeMenu from './screens/homemenu';
import Home from './screens/home';
import Login from './screens/login';
import Signup from './screens/signup';
import Logout from './screens/logout';
import Account from './screens/account';
import Location from './screens/location';
import Review from './screens/review';
import AboutUs from './screens/aboutus';
import MyReviews from './screens/myreviews';
import FavouriteCafes from './screens/favouritecafes';
import UpdateReview from './screens/updatereview';

const Stack = createStackNavigator();

export default function Screens() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="HomeMenu" component={HomeMenu} />
            <Stack.Screen name="Home" component={Home} options={{headerLeft: null}} />
            <Stack.Screen name="ListView" component={ListView} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="Review" component={Review} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="MyReviews" component={MyReviews} />
            <Stack.Screen name="FavouriteCafes" component={FavouriteCafes} />
            <Stack.Screen name="UpdateReview" component={UpdateReview} />

        </Stack.Navigator>
    </NavigationContainer>
  );
}

