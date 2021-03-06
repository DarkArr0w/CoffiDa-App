import React, { Component } from 'react';
import { ActivityIndicator, Text, Button, Image, TouchableOpacity, View, ToastAndroid, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class MyReviews extends Component{

  constructor(props){
    super(props);
  
    this.state = {
      isLoading: true,
      photo: false,
      userData: null
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

deleteReview = async (review_id, location_id) => {
  let token = await AsyncStorage.getItem('@token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id,
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
  .then((response) => {
    if(response.status === 200){
        this.getData();
      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
    }else{
      throw 'Something went wrong';
    }
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

getPhoto = async (review_id, location_id) => {

  let token = await AsyncStorage.getItem('@token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id+"/photo",
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
}

deletePhoto = async (review_id, location_id) => {
  let token = await AsyncStorage.getItem('@token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id+"/photo",
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'image/jpegn',
      'X-Authorization': token
    }
  })
  .then((response) => {
    if(response.status === 200){
        this.getData();
      ToastAndroid.show("Deleted Photo", ToastAndroid.SHORT);
    }else{
      throw 'Something went wrong';
    }
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
          <Text>My Reviews</Text>
          <FlatList
            contentContainerStyle={{ paddingBottom: 10}}
            data={this.state.userData.reviews}
            renderItem={({item}) => (
              <View style={{padding: 10}}>
                <Text>Locaion Name: {item.location.location_name}</Text>
                <Text>Overall Rating: {item.review.overall_rating}</Text>
                <Text>Price: {item.review.price_rating}</Text>
                <Text>Quality: {item.review.quality_rating}</Text>
                <Text>Clenliness: {item.review.clenliness_rating}</Text>
                <Text>Review: {item.review.review_body}</Text>
                <Text>Likes: {item.review.likes}</Text>
                <Text>id: {item.review.review_id}</Text>
                <Text>Loc id: {item.location.location_id}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('UpdateReview', 
                {
                  overall_rating: item.review.overall_rating, 
                  price_rating: item.review.price_rating,
                  quality_rating: item.review.quality_rating,
                  clenliness_rating: item.review.clenliness_rating,
                  review_body: item.review.review_body,
                  review_id: item.review.review_id,
                  location_id: item.location.location_id
                })}>
                <Text>Update Review</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deleteReview(item.review.review_id, item.location.location_id)}>
                <Text>Delete Review</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deletePhoto(item.review.review_id, item.location.location_id)}>
                <Text>Delete Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.getPhoto(item.review.review_id, item.location.location_id)}>
                <Text>Load Photo</Text>
                </TouchableOpacity>
                
              </View>
            )}
            keyExtractor={(item) => item.review.review_id.toString()}
          />

        </View>
      )
    }
   
  }
}

export default MyReviews;