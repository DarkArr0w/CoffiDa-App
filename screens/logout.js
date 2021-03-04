import React, { Component } from 'react';
import { View, Text, Button, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component{
  constructor(props){
    super(props);
    this.state = {
      token: ''
    }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getToken();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  getToken = async () => {
        const value = await AsyncStorage.getItem('@token');
        if(value !== null) {
          this.setState({token: value});
        }else{
          this.props.navigation.navigate("Login");
        }
    }

  logout = async () => {
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@id');
    await AsyncStorage.removeItem('@first_name');
    await AsyncStorage.removeItem('@last_name');
    await AsyncStorage.removeItem('@email');
    await AsyncStorage.removeItem('@favourite_locations');
    await AsyncStorage.removeItem('@liked_reviews');
    await AsyncStorage.removeItem('@reviews');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout",
    {
      method: 'POST',
      headers: {
        'X-Authorization': this.state.token
      },
    })
    .then((response) => {
      if(response.status === 200){
        ToastAndroid.show("Successfully Logged Out", ToastAndroid.SHORT);
        this.props.navigation.popToTop();
      }else if(response.status === 401){
        ToastAndroid.show("Not Logged In", ToastAndroid.SHORT);
        this.props.navigation.popToTop();
      }else{
        throw 'Something went wrong';
      }
    })
    .catch((error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  render(){
    return(
        <View>
            <Button onPress={() => this.props.navigation.navigate('Account')} title="Account" />
            <Button onPress={() =>  this.logout()} title="Logout" />
        </View>
    );
  }
}

export default Logout;