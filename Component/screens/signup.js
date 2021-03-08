import React, { Component } from 'react';
import { View, Text, Switch, TouchableOpacity, ToastAndroid, ScrollView, ImageBackground, TextInput, StyleSheet } from 'react-native';

class Signup extends Component{
  constructor(props){
    super(props);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      showPassword: true
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
    .then((response) => {
      if(response.status === 201){
        ToastAndroid.show("Successfully Created", ToastAndroid.SHORT);
        this.props.navigation.navigate('Login');
        return response.json()
      }if(response.status === 400){
        ToastAndroid.show("Invalid Credentials", ToastAndroid.SHORT);
      }else{
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
        console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render(){
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../Images/Coffee_Cup(0.3).jpg")} style={styles.image}>
          <ScrollView>
            <Text  style={styles.text}> Complete Form to Register Account </Text>
            <Text style={styles.formLabel}>First Name:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="enter first name"
              onChangeText={(first_name) => this.setState({first_name})}
              value={this.state.first_name}
            />
            <View style={styles.space} />
            <Text style={styles.formLabel}>Last Name:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="enter last name"
              onChangeText={(last_name) => this.setState({last_name})}
              value={this.state.last_name}
            />
            <View style={styles.space} />
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="enter email"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            <View style={styles.space} />
            <Text style={styles.formLabel}>Password:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="enter password"
              input type="password"
              secureTextEntry={this.state.showPassword}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
            <Switch         
              trackColor={{ false: 'rgba(248, 114, 23, 0.25)', true: 'rgba(248, 114, 23, 0.6)' }}
              thumbColor={this.state.showPassword ? '#FFDEC7' : 'rgb(248, 114, 23)'}
              onValueChange={this.toggleSwitch}
              value={!this.state.showPassword}
            /> 
            <View style={styles.space} />
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.addUser()}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  image: {
    flex: 1,
    resizeMode:'cover',
    height: 500,
  },
  button: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 50,
    padding: 10,
    width: '70%',
    left: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
    buttonText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
  },
  formInput: {
    borderWidth:1,
    borderColor: 'rgba(248, 114, 23, 0.7)',
    borderRadius:5,
    fontSize:13,
  },
  formLabel: {
    fontSize:15,
    color:'rgba(248, 114, 23, 1)'
  },
  text:{
    fontSize: 16,
    color: 'black',
    padding: 3,
    alignSelf: 'center',
  },
  space: {
    height: 15,
    width: 15,
  },
});

export default Signup;