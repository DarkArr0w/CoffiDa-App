import React, { Component } from 'react';
import { View, Text, Button, Alert, ToastAndroid, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Account extends Component{
  constructor(props){
    super(props);
  
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.userinfo();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  userinfo = async () => {
    let firstname = await AsyncStorage.getItem('@first_name');
    this.setState({first_name: firstname});

    let lastname = await AsyncStorage.getItem('@last_name');
    this.setState({last_name: lastname});

    let Email = await AsyncStorage.getItem('@email');
    this.setState({email: Email});
  }

  update = async () => {
    let token = await AsyncStorage.getItem('@token');
    let id = await AsyncStorage.getItem('@id');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+id,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 200){
          ToastAndroid.show("Successfully Updated", ToastAndroid.SHORT);
        }else{
          throw 'Something went wrong';
        }
      })
  }

  render(){
    return (
      <View>
        <Text>Update</Text>
        <TextInput
          placeholder="First name: "
          onChangeText={(first_name) => this.setState({first_name})}
          value={this.state.first_name}
        />
        <TextInput
          placeholder="Surname: "
          onChangeText={(last_name) => this.setState({last_name})}
          value={this.state.last_name}
        />
        <TextInput
          placeholder="Email: "
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          placeholder="Enter new password: "
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
  
        <Button
          title="Update"
          onPress={() => this.update()}
        />
      </View>
    );
  }
}

export default Account;