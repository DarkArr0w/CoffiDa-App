import React, { Component } from 'react';
import { ActivityIndicator, Text, View, ToastAndroid, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class Location extends Component{


  constructor(props){
    super(props);
  
    this.state = {
  //    location_id: 0,
      location: null,
      isLoading: true
    }
  }

  componentDidMount(){
   //const loc_id = this.props.route.params.location_id;
   this.getData();
  }

  

  getData = () => {;
    const loc_id = this.props.route.params.location_id;
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id)
  .then((response) => {
    if(response.status === 200){
      return response.json()
    }else{
      throw 'Something went wrong';
    }
  })
  .then((responseJson) => {
    this.setState({
      isLoading: false,
      location: responseJson
    })
    console.log(this.state.location.location_id);
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}




  render(){
    console.log(this.state.location_id);
    if(this.state.isLoading){
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )
    }else{
      return (
        <View>
          <Text>{this.state.location.location_name}</Text>
          <Button onPress={() => this.props.navigation.navigate('Review', {location_id: this.state.location.location_id})} title="Add Review" />
        </View>
      )
    }
   
  }
}

export default Location;