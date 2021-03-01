import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ListView from './screens/listview';
import Menu from './screens/menu';
import Home from './screens/home';
import Login from './screens/login';
import Signup from './screens/signup';
import Logout from './screens/logout';
import Account from './screens/account';

const Stack = createStackNavigator();

export default function Screens() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ListView" component={ListView} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Account" component={Account} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

