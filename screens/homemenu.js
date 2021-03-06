import React, { Component } from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeMenu extends Component{

  constructor(props){
    super(props);

    this.state = {
      token: ''
    }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({token: ""});
      this.getToken();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }
  

  getToken = async () => {
    const value = await AsyncStorage.getItem('@token');
      if(value !== null) {
        this.props.navigation.navigate('Home');
      } else {
        console.log('No user yet Created');
      }
  }

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

export default HomeMenu;