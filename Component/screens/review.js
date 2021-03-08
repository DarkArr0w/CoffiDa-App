import React, { Component } from 'react';
import { Text, Alert,ImageBackground, ScrollView, TouchableOpacity, StyleSheet, TextInput, View, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-elements';
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
    const token = await AsyncStorage.getItem('@token');
    const id = await AsyncStorage.getItem('@id');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
    })
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }
        throw 'Something went wrong';
      
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

  sendToServer = async (data) => {
    console.log(data.uri);
    const token = await AsyncStorage.getItem('@token');
    const loc_id = this.props.route.params.location_id;
    const rev_id = this.state.review_id;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${loc_id}/review/${rev_id}/photo`,
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
    const profanity = ["tea","teas","cake","cakes","pastry","pastries"];
    const reviewtext = this.state.review_body;
    if(profanity.some(word => reviewtext.toLowerCase().includes(word))){
      ToastAndroid.show("Please only refer to coffee in your review.", ToastAndroid.SHORT);
    }else{
      const id = this.props.route.params.location_id;
      console.log(id);
      const token = await AsyncStorage.getItem('@token');
      return fetch(`${"http://10.0.2.2:3333/api/1.0.0/location"+"/"}${id}/review`,
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
  }
  
  ratingCompleted(rating, name) {
    const stateObject = () => {
      const returnObj = {};
      returnObj[name] = rating;
      return returnObj;
    };
    this.setState( stateObject );
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
    }
      return (
        <View style={styles.container3}>
          <ImageBackground
            source={require("../../Images/Coffee_Cup(0.3).jpg")} style={styles.image}>
            <ScrollView>
              <Text style={styles.formLabel}>Overall Rating:</Text>
              <AirbnbRating
                defaultRating={0}
                size={18}
                showRating={false}
                isDisabled={false}
                selectedColor='#F87217'
                unSelectedColor='#DDDDDD'
                onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
              />
              <Text style={styles.formLabel}>Price Rating:</Text>
              <AirbnbRating
                defaultRating={0}
                size={18}
                showRating={false}
                isDisabled={false}
                selectedColor='#F87217'
                unSelectedColor='#DDDDDD'
                onFinishRating={(rating) => this.ratingCompleted(rating, "price_rating")}
              />
              <Text style={styles.formLabel}>Quality Rating:</Text>
              <AirbnbRating
                defaultRating={0}
                size={18}
                showRating={false}
                isDisabled={false}
                selectedColor='#F87217'
                unSelectedColor='#DDDDDD'
                onFinishRating={(rating) => this.ratingCompleted(rating, "quality_rating")}
              />
              <Text style={styles.formLabel}>Cleanliness Rating:</Text>
              <AirbnbRating
                defaultRating={0}
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
                onPress={() => this.addReview()}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </ScrollView>
          </ImageBackground>
        </View>
      );
    
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
export default Review;