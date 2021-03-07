import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, Image, TouchableOpacity, Text, View, Card, ToastAndroid, Button, FlatList, Alart } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class Location extends Component{


  constructor(props){
    super(props);
  
    this.state = {
      location: null,
      reviews: null,
      isLoading: true,
      favourited: false,
      liked: false,
      rev_id: null,
      photo_path: null,
      photo: false
    }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
    this.getData();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
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
      reviews: responseJson.location_reviews,
      location: responseJson
    })
    console.log("");
    console.log(this.state.reviews);
    console.log("");
    console.log(this.state.location);
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

favourite = async () => {

  let token = await AsyncStorage.getItem('@token');
  const loc_id = this.props.route.params.location_id;

  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/favourite",
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
  .then((response) => {
    if(response.status === 200) {
      this.setState({
        favourited: true,
      });
      ToastAndroid.show("Favourited", ToastAndroid.SHORT);
    }else{
      throw 'Something went wrong';
    }
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

unfavourite = async () => {

  let token = await AsyncStorage.getItem('@token');
  const loc_id = this.props.route.params.location_id;

  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/favourite",
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
  .then((response) => {
    if(response.status === 200){
      this.setState({
        favourited: false,
      });
      ToastAndroid.show("Unfavourited", ToastAndroid.SHORT);
    }else{
      throw 'Something went wrong';
    }
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}


like = async (review_id) => {

  let token = await AsyncStorage.getItem('@token');
  const loc_id = this.props.route.params.location_id;
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/review/"+review_id+"/like",
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
  .then((response) => {
    if(response.status === 200){
      this.setState({
        liked: true,
      });
      ToastAndroid.show("Liked", ToastAndroid.SHORT);
    }else{
      throw 'Something went wrong';
    }
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}


unlike = async (review_id) => {
  let token = await AsyncStorage.getItem('@token');
  const loc_id = this.props.route.params.location_id;
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/review/"+review_id+"/like",
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
  .then((response) => {
    if(response.status === 200){
      this.setState({
        liked: false,
      });
      ToastAndroid.show("Unliked", ToastAndroid.SHORT);
    }else{
      throw 'Something went wrong';
    }
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

getPhoto = async (review_id) => {

  let token = await AsyncStorage.getItem('@token');
  const loc_id = this.props.route.params.location_id;
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/review/"+review_id+"/photo",
  {
    headers: {
      "Content-Type": "image/jpeg",
      "X-Authorization": token
    },
  })
  .then((response) => {
      if (response.status === 200) {
        this.setState({
          photo_path: response.url+"?timestamp="+Date.now(),
          photo: true
        })
        console.log("");
        console.log(this.state.photo_path);
     
      ToastAndroid.show("Photo Got Successfully", ToastAndroid.SHORT);
    }else if(response.status === 404){
      this.setState({
        photo_path: null,

      })
      ToastAndroid.show("No Photo", ToastAndroid.SHORT);
    }else{
      throw 'Something went wrong';
    }
  })

  
  .catch((error) => {
    console.error(error);
  });
}

checkFavourite(){
  if(this.state.favourited === false) {
    this.favourite();
  }
  else if(this.state.favourited === true){
    this.unfavourite();
  }
}

checkLike(review_id){
  if(this.state.liked === false) {
    this.like(review_id);
  }
  else if(this.state.liked === true){
    this.unlike(review_id);
  }
}

  render(){
    if(this.state.isLoading){
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )
    }else if (this.state.photo){
     return(
      <View>
        <Image
        style={{width: 200, height: 200}}
        source={{uri: this.state.photo_path}}
      />
      <Button onPress={() =>  this.setState({photo:false})} title="Go Back" />
      </View>
      )
    }else{
      return (
        <View style={{flex:1}}>
          <Text>{this.state.location.location_name}</Text>
          <Button onPress={() =>  this.checkFavourite()} title="Favourite" />
          <Button onPress={() => this.props.navigation.navigate('Review', {location_id: this.state.location.location_id})} title="Add Review" />
          <Text>Reviews</Text>
          <FlatList
            data={this.state.reviews}
            renderItem={({item}) => (
              <View style={{padding: 10}}>
                <Text>Overall Rating: {item.overall_rating}</Text>
                <Text>Price: {item.price_rating}</Text>
                <Text>Quality: {item.quality_rating}</Text>
                <Text>Clenliness: {item.clenliness_rating}</Text>
                <Text>Review: {item.review_body}</Text>
                <Text>Likes: {item.likes}</Text>
                <Text>id: {item.review_id}</Text>
                <TouchableOpacity onPress={() => this.checkLike(item.review_id)}>
                <Text>Like?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.getPhoto(item.review_id)}>
                <Text>Load Photo</Text>
                </TouchableOpacity>
                
              </View>
            )}
            keyExtractor={({review_id}) => review_id.toString()}
          />

        </View>
      )
    }
   
  }
}

export default Location;