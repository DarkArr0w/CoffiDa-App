import React, { Component } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity,ImageBackground, ToastAndroid, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class Login extends Component{
  constructor(props){
    super(props);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.state = {
      email: '',
      password: '',
      showPassword: true
    }
  }

  Login = async () => {
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
      this.props.navigation.navigate('Home');
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
          source={require('./../../Images/Coffee_Cup(0.3).jpg')} style={styles.image}>
          <ScrollView>
            <Text  style={styles.text}> Enter Credentials </Text>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.Login()}>
              <Text style={styles.buttonText}>Login</Text>
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
    borderColor: 'rgba(248, 114, 23, 0.5)',
    borderRadius:5,
    fontSize:13,
  },
  formLabel: {
    fontSize:15,
    color:'rgba(248, 114, 23, 0.9)'
  },
  text:{
    fontSize: 16,
    color: 'black',
    padding: 3,
    alignSelf: 'center',
    fontFamily: 'Roboto',
  },
  space: {
    height: 15,
    width: 15,
  },
});

export default Login;