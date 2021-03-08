import React, { Component } from 'react';
import { Text, Alert,ImageBackground, ScrollView, TouchableOpacity, StyleSheet, TextInput, View, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-elements';
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
    const profanity = ["tea","teas","cake","cakes","pastry","pastries"];
    const reviewtext = this.state.review_body;
    if(profanity.some(word => reviewtext.toLowerCase().includes(word))){
      ToastAndroid.show("Please only refer to coffee in your review.", ToastAndroid.SHORT);
    }else{
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
  }

  render(){
    if(this.state.photo){
      return (
        <View style={styles.container}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addPhoto()}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      )
    }else{
      return (
        <View style={styles.container3}>
          <ImageBackground
            source={require('./../../Images/Coffee_Cup(0.3).jpg')} style={styles.image}>
            <ScrollView>
              <Text style={styles.formLabel}>Overall Rating:</Text>
              <AirbnbRating
                defaultRating={this.state.overall_rating}
                size={18}
                showRating={false}
                isDisabled={false}
                selectedColor='#F87217'
                unSelectedColor='#DDDDDD'
                onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
              />
             <Text style={styles.formLabel}>Price Rating:</Text>
              <AirbnbRating
                defaultRating={this.state.price_rating}
                size={18}
                showRating={false}
                isDisabled={false}
                selectedColor='#F87217'
                unSelectedColor='#DDDDDD'
                onFinishRating={(rating) => this.ratingCompleted(rating, "price_rating")}
              />
              <Text style={styles.formLabel}>Quality Rating:</Text>
             <AirbnbRating
                defaultRating={this.state.quality_rating}
                size={18}
                showRating={false}
                isDisabled={false}
                selectedColor='#F87217'
                unSelectedColor='#DDDDDD'
                onFinishRating={(rating) => this.ratingCompleted(rating, "quality_rating")}
              />
              <Text style={styles.formLabel}>Cleanliness Rating:</Text>
              <AirbnbRating
                defaultRating={this.state.clenliness_rating}
                size={18}
                showRating={false}
                isDisabled={false}
                selectedColor='#F87217'
                unSelectedColor='#DDDDDD'
                onFinishRating={(rating) => this.ratingCompleted(rating, "clenliness_rating")}
              />
              <Text style={styles.formLabel}>Review:</Text>
              <TextInput
                value={this.state.review_body}
                style={styles.formInput}
                placeholder="enter review"
                onChangeText={(reviewbody) => this.setState({review_body: reviewbody})}
              />
              <View style={styles.space2} />
              <TouchableOpacity
                style={styles.button2}
                onPress={() => this.updateReview()}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </ScrollView>
          </ImageBackground>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode:'cover',
    height: 500,
  },
  container3: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(148, 199, 246)',
  },
  button2: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 50,
    padding: 10,
    width: '70%',
    left: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 30,
    width: '40%',
    left: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
    buttonText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
  },
  formInput: {
    borderWidth:1,
    borderColor: 'rgba(248, 114, 23, 0.7)',
    borderRadius:5,
    fontSize:13,
    height: 35,
  },
  formLabel: {
    fontSize:15,
    color:'black',
    fontFamily: 'Roboto',
  },
  space2:{
    height: 15,
  },
});
export default UpdateReview;