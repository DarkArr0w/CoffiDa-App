import React, { Component } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, ToastAndroid, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class FavouriteCafes extends Component{

  constructor(props){
    super(props);
  
    this.state = {
      isLoading: true,
      userData: null
    }
  }

  componentDidMount(){
      this.getData();
  }

  
  getData = async () => {
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
  .then((responseJson) => {
    this.setState({
      isLoading: false,
      userData: responseJson
    })

    console.log(responseJson);
   
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

  render(){
    if(this.state.isLoading){
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )
    }else{
      return (
        <View>
          <Text>Fav Locations</Text>
          <FlatList
            contentContainerStyle={{ paddingBottom: 10}}
            data={this.state.userData.favourite_locations}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Location', {location_id: item.location_id})}>
              <View style={{padding: 10}}>
                <Text>ID: {parseInt(item.location_id)}</Text>
                <Text>{item.location_name}</Text>
                <Text>{item.location_town}</Text>
                <Text>Rating: {item.avg_overall_rating}</Text>
              </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item)=> item.location_id.toString()}
          />
        </View>
      );
    }
   
  }
}

export default FavouriteCafes;