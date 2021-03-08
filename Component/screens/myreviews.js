import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Image, ImageBackground, TouchableOpacity, Text, View, ToastAndroid, FlatList } from 'react-native';
import { AirbnbRating } from 'react-native-elements'; 
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
    const token = await AsyncStorage.getItem('@token');
    const id = await AsyncStorage.getItem('@id');
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
    }
      throw 'Something went wrong';
    
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
  const token = await AsyncStorage.getItem('@token');
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
  const token = await AsyncStorage.getItem('@token');
  return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location_id}/review/${review_id}/photo`,
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
  const token = await AsyncStorage.getItem('@token');
  return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location_id}/review/${review_id}/photo`,
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
        <View style={styles.container}>
          <Text  style={styles.text}> Loading... </Text>
          <ActivityIndicator size="large" color="#f87217" />
        </View>
      )
    }if (this.state.photo){
      return(
        <View style={styles.container4}>
          <Image
            style={{
              flex:1,
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
            source={{uri: this.state.photo_path}}
          />
          <TouchableOpacity
            style={styles.button3}
            onPress={() =>  this.setState({photo:false})}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )
    }
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require("../../Images/Coffee_Cup(0.3).jpg")} style={styles.image}>
            <FlatList
              data={this.state.userData.reviews}
              renderItem={({item}) => (
                <View style={{paddingLeft: 10}, {paddingRight: 10}}>
                  <Text style={styles.text2}>{item.location.location_name} in {item.location.location_town}</Text>
                  <View style={styles.space2} />
                  <Text style={styles.text4}>Overall Rating:</Text>
                  <AirbnbRating
                    defaultRating={item.overall_rating}
                    size={18}
                    showRating={false}
                    isDisabled
                    selectedColor='#F87217'
                    unSelectedColor='#DDDDDD'
                  />
                  <View style={styles.space} />
                  <View style={styles.horizontal2}>
                    <Text style={styles.text5}>Price Rating:</Text>
                    <Text style={styles.text5}>Quality Rating:</Text>
                    <Text style={styles.text5}>Cleanliness Rating:</Text>
                  </View>
                  <View style={styles.horizontal2}>
                    <AirbnbRating
                      defaultRating={item.price_rating}
                      size={12}
                      showRating={false}
                      isDisabled
                      selectedColor='#F87217'
                      unSelectedColor='#DDDDDD'
                    />
                    <AirbnbRating
                      defaultRating={item.quality_rating}
                      size={12}
                      showRating={false}
                      isDisabled
                      selectedColor='#F87217'
                      unSelectedColor='#DDDDDD'
                    />
                    <AirbnbRating
                      defaultRating={item.clenliness_rating}
                      size={12}
                      showRating={false}
                      isDisabled
                      selectedColor='#F87217'
                      unSelectedColor='#DDDDDD'
                    />
                  </View>
                  <View style={styles.space2} />
                  <Text>Review:{"\n"}{item.review_body}</Text>
                  <View style={styles.space2} />
                  <Text>Likes: {item.likes}</Text>
                  <View style={styles.space2} />
                  <View style={styles.horizontal2}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.props.navigation.navigate('UpdateReview', {
                        overall_rating: item.review.overall_rating, 
                        price_rating: item.review.price_rating,
                        quality_rating: item.review.quality_rating,
                        clenliness_rating: item.review.clenliness_rating,
                        review_body: item.review.review_body,
                        review_id: item.review.review_id,
                        location_id: item.location.location_id
                      })}>
                      <Text style={styles.text5}>Update{"\n"}Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>  this.deleteReview(item.review.review_id, item.location.location_id)}>
                      <Text style={styles.text5}>Delete{"\n"}Review</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.space2} />  
                  <View style={styles.horizontal2}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.getPhoto(item.review.review_id, item.location.location_id)}>
                    <Text style={styles.text5}>Load{"\n"}Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.deletePhoto(item.review.review_id, item.location.location_id)}>
                    <Text style={styles.text5}>Delete{"\n"}Photo</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.space2} />  
                <View style={styles.row} />
              </View>
              )}
              keyExtractor={(item) => item.review.review_id.toString()}
            />
          </ImageBackground>
        </View>
      )
    
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(148, 199, 246)',
    paddingLeft:20,
    paddingRight:20,
  },
  container4: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  horizontal2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  image: {
    flex: 1,
    resizeMode:'cover',
    height: 500,
  },
  button: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 2,
  },
  button3: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 30,
    width: '40%',
    left: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
  },
  text:{
    fontSize: 16,
    color: 'black',
    padding: 3,
    alignSelf: 'center',
    fontFamily: 'Roboto',
  },
  text2:{
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  text4:{
    fontSize: 18,
    color: 'black',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  text5:{
    fontSize: 12,
    color: 'black',
    fontFamily: 'Roboto',
    alignItems: 'center',
  },
  space: {
    height: 15,
    width: 15,
  },
  space2: {
    height: 5,
  },
  row: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
});
export default MyReviews;