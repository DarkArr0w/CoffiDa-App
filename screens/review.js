import React, { Component } from 'react';
import { Text, Alert, TextInput, View, ToastAndroid, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-elements';
import { RNCamera } from 'react-native-camera';

class Review extends Component{

  constructor(props){
    super(props);
  
    this.state = {
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      review_body: "",
      review_id: 0,
      photo: false,
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
    const loc_id = this.props.route.params.location_id;
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
        this.props.navigation.navigate('Location');
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
    ToastAndroid.show("Review Successfully Added", ToastAndroid.SHORT);
    this.props.navigation.navigate('Location');
  }

  addReview = async () =>{
    const id = this.props.route.params.location_id;
    console.log(id);
    let token = await AsyncStorage.getItem('@token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location"+"/"+id+"/review",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      console.log(response.status);
      if(response.status === 201){
        this.getUserInfo();
        Alert.alert(
          'Alert',
          'Do you want to add photo?',
          [
            {text: 'No', onPress: () => this.exit(), style: 'cancel'},
            {text: 'Yes', onPress: () => this.setState({photo: true})},
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
            defaultRating={0}
            onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
          />
          <Text>Price Rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingCompleted(rating, "price_rating")}
          />

          <Text>Quality Rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingCompleted(rating, "quality_rating")}
          />
          <Text>Clenliness Rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingCompleted(rating, "clenliness_rating")}
          />

          <TextInput
            onChangeText={(reviewbody) => this.setState({review_body: reviewbody})}
            value={this.state.review_body}
          />
          <Button title="Upload" onPress={() => this.addReview()} />
        </View>
      );
    }
  }
}


export default Review;