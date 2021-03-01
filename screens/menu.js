import React, { Component } from 'react';
import { Button, View } from 'react-native';

class Menu extends Component{
  render(){
    const nav = this.props.navigation;
    return(
        <View>
            <Button onPress={() => nav.navigate('Login')} title="Login" />
            <Button onPress={() => nav.navigate('Signup')} title="Sign Up" />
        </View>
    );
  }
}

export default Menu;