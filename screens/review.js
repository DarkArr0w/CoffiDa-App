import React, { Component } from 'react';
import { Text, TextInput, View, ToastAndroid, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-elements';

class Review extends Component{

  constructor(props){
    super(props);
  
    this.state = {
//    location_id: 0,
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      review_body: ""

    }
  }


  ratingCompleted(rating, name) {
    let stateObject = () => {
      let returnObj = {};
      returnObj[name] = rating;
      return returnObj;
    };
    this.setState( stateObject );
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
        ToastAndroid.show("Review Added", ToastAndroid.SHORT);
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
      return (
        <View>
          <Text>Review</Text>
          <Text>Overall Rating</Text>
          <AirbnbRating
            size={15}
            defaultRating={0}
            onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
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


export default Review;