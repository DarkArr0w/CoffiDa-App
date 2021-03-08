import React, { Component } from 'react';
import { View, Text, Switch, ToastAndroid, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Account extends Component{
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

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.userinfo();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  userinfo = async () => {
    const firstname = await AsyncStorage.getItem('@first_name');
    this.setState({first_name: firstname});
    const lastname = await AsyncStorage.getItem('@last_name');
    this.setState({last_name: lastname});
    const Email = await AsyncStorage.getItem('@email');
    this.setState({email: Email});
  }
  
  update = async () => {
    const token = await AsyncStorage.getItem('@token');
    const id = await AsyncStorage.getItem('@id');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify(this.state)
    })
    .then(async(response) => {
      if(response.status === 200){
        await AsyncStorage.setItem('@first_name', this.state.first_name);
        await AsyncStorage.setItem('@last_name', this.state.last_name);
        await AsyncStorage.setItem('@email', this.state.email);
        ToastAndroid.show("Successfully Updated", ToastAndroid.SHORT);
        this.props.navigation.navigate('Logout');
      }else{
        throw 'Something went wrong';
      }
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
            <Text  style={styles.text}> Account Information </Text>
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
              onChangeText={(last_name) => this.setState({last_name})}
              value={this.state.last_name}
            />
            <View style={styles.space} />
            <Text style={styles.formLabel}>Email:</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            <View style={styles.space} />
            <Text style={styles.formLabel}>Change Password?</Text>
            <TextInput
              style={styles.formInput}
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
              onPress={() => this.update()}>
              <Text style={styles.buttonText}>Update</Text>
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
    fontFamily: 'Roboto',
  },
  space: {
    height: 15,
    width: 15,
  },
});
export default Account;