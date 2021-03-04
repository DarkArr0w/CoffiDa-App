import React, { Component } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';

class Signup extends Component{
  constructor(props){
    super(props);
  
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
  }

  addUser(){
    return fetch("http://10.0.2.2:3333/api/1.0.0/user",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        Alert.alert("User Added!");
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render(){
    return (
      <View>
        <Text>Signup</Text>
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
          placeholder="Password: "
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
  
        <Button
          title="Add"
          onPress={() => this.addUser()}
        />
      </View>
    );
  }
}

export default Signup;