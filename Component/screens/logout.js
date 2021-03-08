import React, { Component } from 'react';
import { View, Text, StyleSheet, ToastAndroid, TouchableOpacity,ImageBackground } from 'react-native';
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
    } else {
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
      } else if (response.status === 401){
        ToastAndroid.show("Not Logged In", ToastAndroid.SHORT);
        this.props.navigation.popToTop();
      } else {
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
      <View style={styles.container}>
        <ImageBackground
          source={require('./../../Images/Coffee_Cup(0.3).jpg')} style={styles.image}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Account')}>
            <Text style={styles.buttonText}>Account Info</Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('FavouriteCafes')}>
            <Text style={styles.buttonText}>Favourite Cafes</Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('MyReviews')}>
            <Text style={styles.buttonText}>My Reviews</Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('AboutUs')}>
            <Text style={styles.buttonText}>About Us</Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.logout()}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  button: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 50,
    padding: 10,
    width: '70%',
    top: 60,
    left: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  image: {
    flex: 1,
    resizeMode:'cover',
    height: 500,
  },
    buttonText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
  },
  space: {
    height: 25,
  },
});
export default Logout;