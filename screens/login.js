import React, { Component } from 'react';
import { View, Text, Button, Alert, ToastAndroid, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class Login extends Component{
  constructor(props){
    super(props);
  
    this.state = {
      email: '',
      password: '',
    }
  }

  addUser = async () => {
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/login",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      if(response.status === 200){
        ToastAndroid.show("Successfully Logged In", ToastAndroid.SHORT);
        return response.json()
      }else if(response.status === 400){
        ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT);
      }else{
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
      console.log(responseJson);
      await AsyncStorage.setItem('@token', responseJson.token);
      await AsyncStorage.setItem('@id', JSON.stringify(responseJson.id));
      this.getUserInfo();
      this.props.navigation.popToTop();
    })
    .catch((error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }


  getUserInfo = async () => {
    let token = await AsyncStorage.getItem('@token');
    let id = await AsyncStorage.getItem('@id');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+id,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
    })
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }else{
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
      console.log(responseJson);
      await AsyncStorage.setItem('@first_name', responseJson.first_name);
      await AsyncStorage.setItem('@last_name', responseJson.last_name);
      await AsyncStorage.setItem('@email', responseJson.email);
 //   await AsyncStorage.setItem('@favourite_locations', responseJson.favourite_locations);
 //   await AsyncStorage.setItem('@liked_reviews', responseJson.liked_reviews);
 //   await AsyncStorage.setItem('@reviews', responseJson.reviews);
    })
    .catch((error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  
  render(){
    return (
      <View>
        <Text>Log In</Text>
        <TextInput
          placeholder="Email: "
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          placeholder="Password: "
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
  
        <Button
          title="Login"
          onPress={() => this.addUser()}
        />
        
      </View>
    );
  }
}
export default Login;