import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Image, ImageBackground, TouchableOpacity, Text, View, ToastAndroid, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-elements'; 

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
      this.getUserInfo();
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
      this.getUserInfo();
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
      this.getUserInfo();
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

getUserInfo = async () => {
  let token = await AsyncStorage.getItem('@token');
  let id = await AsyncStorage.getItem('@id');
  return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+id,
  {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token,      
    },
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } if (response.status === 400) {
      ToastAndroid.show("Invalid email or password", ToastAndroid.SHORT);
    } else {
      throw 'Something went wrong';
    }
  })
  .then(async (responseJson) => {
    this.setState({
      userLiked: responseJson.liked_reviews,
      userFavourite: responseJson.favourite_locations
    });
    this.getData();
    })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  });
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
      this.getUserInfo();
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
      this.getUserInfo();
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
    } else if (response.status === 404){
      this.setState({
        photo_path: null,
      })
      ToastAndroid.show("No Photo", ToastAndroid.SHORT);
    } else {
      throw 'Something went wrong';
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

checkIfFavourited = (location_id) => {
  const { userFavourite } = this.state;
  this.state.favourited = false;
  for (let i = 0; i < userFavourite.length; i += 1) {
    if (userFavourite[i].location_id === location_id) {
      this.state.favourited = true;
    }
  }
}

checkIfLiked = (review_id) => {
  const { userLiked } = this.state;
  this.state.liked = false;
  for (let i = 0; i < userLiked.length; i += 1) {
    if (userLiked[i].review.review_id === review_id) {
      this.state.liked = true;
    }
  }
}

  render(){
    if(this.state.isLoading){
      return (
        <View style={styles.container}>
          <Text  style={styles.text}> Loading... </Text>
          <ActivityIndicator size="large" color="#f87217" />
        </View>
      )
    } else if (this.state.photo){
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
          <View style={styles.space2} />
          <TouchableOpacity
            style={styles.button3}
            onPress={() =>  this.setState({photo:false})}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require('./../../Images/Coffee_Cup(0.3).jpg')} style={styles.image}>
            <View style={styles.horizontal}>  
              {!this.state.displayreviews && (
                <Text style={styles.text2}>Average Ratings:</Text>
              )}
              <Text style={styles.text3}>{this.state.location.location_name}{"\n"}in {this.state.location.location_town}</Text>
              <Image
                style={styles.cafeLogo}
                source={{ uri: this.state.location.photo_path }}
              />
            </View>
            <View style={styles.row} />
            <View style={styles.space2} />
            {!this.state.displayreviews && (
              <View>
                <Text style={styles.text4}>Overall Rating:</Text>
                <AirbnbRating
                  defaultRating={this.state.location.avg_overall_rating}
                  size={18}
                  showRating={false}
                  isDisabled={true}
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
                  defaultRating={this.state.location.avg_price_rating}
                  size={12}
                  showRating={false}
                  isDisabled={true}
                  selectedColor='#F87217'
                  unSelectedColor='#DDDDDD'
                />
                <AirbnbRating
                  defaultRating={this.state.location.avg_quality_rating}
                  size={12}
                  showRating={false}
                  isDisabled={true}
                  selectedColor='#F87217'
                  unSelectedColor='#DDDDDD'
                />
                <AirbnbRating
                  defaultRating={this.state.location.avg_clenliness_rating}
                  size={12}
                  showRating={false}
                  isDisabled={true}
                  selectedColor='#F87217'
                  unSelectedColor='#DDDDDD'
                />
              </View>
              <View style={styles.space2} />
              <View style={styles.horizontal2}>
                {
                  this.checkIfFavourited(this.state.location.location_id)
                }
                {this.state.favourited && (
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => this.unfavourite(this.state.location.location_id)}>
                    <Text style={styles.buttonText}>Unfavourite</Text>
                  </TouchableOpacity>
                )}
                {!this.state.favourited && (
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => this.favourite(this.state.location.location_id)}>
                    <Text style={styles.buttonText}>Favourite</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => this.props.navigation.navigate('Review', {location_id: this.state.location.location_id})}>
                  <Text style={styles.buttonText}>Add Review</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.space2} />
              <View style={styles.row} />
              <View style={styles.space2} />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {this.setState({displayreviews:true})}}>
                <Text style={styles.text5}>Display Reviews</Text>
              </TouchableOpacity>
              <View style={styles.space2} />
            </View>
            )}
            {this.state.displayreviews && (
              <View style={{flex:1}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {this.setState({displayreviews:false})}}>
                  <Text style={styles.text5}>Hide Reviews</Text>
                </TouchableOpacity>
                <Text style={styles.text6}>Reviews:</Text>
                <View style={styles.space2} />
                <View style={styles.row} />
                <FlatList
                  data={this.state.reviews}
                  renderItem={({item}) => (
                    <View style={{paddingLeft: 10}, {paddingRight: 10}}>
                      <Text style={styles.text4}>Overall Rating:</Text>
                      <AirbnbRating
                        defaultRating={item.overall_rating}
                        size={18}
                        showRating={false}
                        isDisabled={true}
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
                        isDisabled={true}
                        selectedColor='#F87217'
                        unSelectedColor='#DDDDDD'
                      />
                      <AirbnbRating
                        defaultRating={item.quality_rating}
                        size={12}
                        showRating={false}
                        isDisabled={true}
                        selectedColor='#F87217'
                        unSelectedColor='#DDDDDD'
                      />
                      <AirbnbRating
                        defaultRating={item.clenliness_rating}
                        size={12}
                        showRating={false}
                        isDisabled={true}
                        selectedColor='#F87217'
                        unSelectedColor='#DDDDDD'
                      />
                    </View>
                    <View style={styles.space2} />
                    <Text>Review:{"\n"}{item.review_body}</Text>
                    <View style={styles.space2} />
                    <View style={styles.horizontal2}>
                      <Text>Likes: {item.likes}</Text>
                      {
                        this.checkIfLiked(item.review_id)
                      }
                      {this.state.liked && (
                        <TouchableOpacity
                          style={styles.button4}
                          onPress={() =>  this.unlike(item.review_id)}>
                          <Text style={styles.text5}>Unlike</Text>
                        </TouchableOpacity>
                      )}
                      {!this.state.liked && (
                        <TouchableOpacity
                          style={styles.button4}
                          onPress={() =>  this.like(item.review_id)}>
                          <Text style={styles.text5}>like</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.space2} />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.getPhoto(item.review_id)}>
                      <Text style={styles.text5}>Load Photo</Text>
                    </TouchableOpacity>
                    <View style={styles.space2} />
                    <View style={styles.row} />
                  </View>
                  )}
                  keyExtractor={({review_id}) => review_id.toString()}
                />
              </View>
            )}
          </ImageBackground>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    paddingLeft:20,
    paddingRight:20,
  },
  container2: {
    flex: 1,
    flexDirection: 'column',
  },
  container3: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  container4: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingLeft: 10,
  },
  horizontal2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    flex: 1,
    resizeMode:'cover',
    height: 500,
  },
  cafeLogo:{
    height: 50,
    width: 50,
  },
  button: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 28,
    width: '40%',
    left: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  button2: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    width: 125,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
  button4: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 20,
    width: '15%',
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
  },
  formLabel: {
    fontSize:15,
    color:'rgba(248, 114, 23, 1)'
  },
  text:{
    fontSize: 16,
    color: 'black',
    padding: 3,
    alignSelf: 'center',
    fontFamily: 'Roboto',
  },
  text2:{
    fontSize: 14,
    color: 'black',
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
    top: 23,
    paddingLeft: 5,
  },
  text3:{
    fontSize: 18,
    color: 'black',
    fontFamily: 'Roboto',
    paddingLeft: 40,
  },
  text4:{
    fontSize: 20,
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
  text6:{
    fontSize: 14,
    color: 'black',
    fontFamily: 'Roboto',
    textDecorationLine: 'underline',
    paddingLeft: 5,
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
export default Location;