import React, { Component } from 'react';
import { TouchableOpacity,ImageBackground, Text, View, StyleSheet } from 'react-native';
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
    }else{
      console.log('No user yet Created');
    }
  }

  render(){
    const nav = this.props.navigation;
    return(
      <View style={styles.container}>
        <ImageBackground msource={require('./../../Images/Coffee_Cup.jpg')} style={styles.image}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => nav.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => nav.navigate('Signup')}>
            <Text style={styles.buttonText}>Sign Up</Text>
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
    backgroundColor: 'rgb(148, 199, 246)',
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
    top: 100,
    left: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 23,
    color: 'black',
    fontFamily: 'Roboto',
  },
  space: {
    height: 30,
  },
});
export default HomeMenu;