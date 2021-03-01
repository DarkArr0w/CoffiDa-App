import React, { Component } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      token: '',
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
        this.setState({token: value});
      } else {
        console.log('No user yet Created');
      }
  }

  render(){
    const nav = this.props.navigation;
    console.log("token: "+this.state.token);
    if (this.state.token !== "") {
      return(
        <View>
          <Button onPress={() => nav.navigate('ListView')} title="List View" />
          <Button onPress={() => nav.navigate('Logout')} title="Menu" />
        </View>
      );
    }else{

      return(
        <View>
            <Button onPress={() => nav.navigate('ListView')} title="List View" />
            <Button onPress={() => nav.navigate('Menu')} title="Menu" />
        </View>
      );
    }
  }
}
export default Home;