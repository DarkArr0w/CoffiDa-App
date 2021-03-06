import React, { Component } from 'react';
import { Text, Alert, TextInput, View, ToastAndroid, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-elements';
import { RNCamera } from 'react-native-camera';

class UpdateReview extends Component{

  constructor(props){
    super(props);
  
    this.state = {
      overall_rating: this.props.route.params.overall_rating,
      price_rating: this.props.route.params.price_rating,
      quality_rating: this.props.route.params.quality_rating,
      clenliness_rating: this.props.route.params.clenliness_rating,
      review_body: this.props.route.params.review_body,
      review_id: this.props.route.params.review_id,
      location_id: this.props.route.params.location_id,
      photo: false
    }
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
      const userReview_id = [];
      for (let i = 0; i < responseJson.reviews.length; i += 1) {
        userReview_id.push(responseJson.reviews[i].review.review_id);
      }
      this.setState({review_id:Math.max.apply(Math, userReview_id)});
      console.log(this.state.review_id);

    })
    .catch((error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }


  ratingCompleted(rating, name) {
    let stateObject = () => {
      let returnObj = {};
      returnObj[name] = rating;
      return returnObj;
    };
    this.setState( stateObject );
  }


  sendToServer = async (data) => {
    console.log(data.uri);
    let token = await AsyncStorage.getItem('@token');
    const loc_id = this.state.location_id;
    const rev_id = this.state.review_id;
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/review/"+rev_id+"/photo",
    {
      method: 'POST',
      headers: {
        "Content-Type": "image/jpeg",
        "X-Authorization": token
      },
      body: data
    })
    .then((response) => {
      if(response.status === 200){
        ToastAndroid.show("Photo Taken", ToastAndroid.SHORT);
        this.props.navigation.navigate('MyReviews');
      }else{
        throw 'Something went wrong';
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  addPhoto = async() => {
    if(this.camera){
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);

      this.sendToServer(data); 
    }
  }

  exit() {
    ToastAndroid.show("Review Successfully Updated", ToastAndroid.SHORT);
    this.props.navigation.navigate('MyReviews');
  }

  deletePhoto = async () => {
    let token = await AsyncStorage.getItem('@token');
    
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.location_id+"/review/"+this.state.review_id+"/photo",
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'image/jpegn',
        'X-Authorization': token
      }
    })
    .then(() => {
          this.setState({photo: true})
    })
    .catch((error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }


  updateReview = async () =>{
    let token = await AsyncStorage.getItem('@token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location"+"/"+this.state.location_id+"/review/"+this.state.review_id,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      console.log(response.status);
      if(response.status === 200){
        this.getUserInfo();
        Alert.alert(
          'Alert',
          'Do you want to change/add photo?',
          [
            {text: 'No', onPress: () => this.exit(), style: 'cancel'},
            {text: 'Yes', onPress: () => this.deletePhoto()}
          ]
        );
      }else{
          throw 'Something went wrong';
      }
    })
    .catch((error) => {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      console.error(error);
    });
  }

  render(){
    if(this.state.photo){
      return (
        <View style={{flex:1}}>
        <RNCamera
          captureAudio={false}
          ref={ref => {
            this.camera = ref;
          }}
          style={{
            flex:1,
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        />
        <Button title="Take Photo" onPress={() => this.addPhoto()} />
      </View>
      )
    }else{
      return (
        <View>
          <Text>Review</Text>
          <Text>Overall Rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={this.state.overall_rating}
            onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
          />

          <TextInput
            onChangeText={(reviewbody) => this.setState({review_body: reviewbody})}
            value={this.state.review_body}
          />
          <Button title="Update" onPress={() => this.updateReview()} />
        </View>
      );
    }
  }
}


export default UpdateReview;