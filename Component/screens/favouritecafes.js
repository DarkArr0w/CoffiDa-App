import React, { Component } from 'react';
import { ActivityIndicator, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, View, ToastAndroid, FlatList } from 'react-native';
import { AirbnbRating } from 'react-native-elements'; 
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
        <View style={styles.container2}>
          <Text  style={styles.text}> Loading... </Text>
          <ActivityIndicator size="large" color="#f87217" />
        </View>
      )
    } 
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require('./../../Images/Coffee_Cup(0.3).jpg')} style={styles.image}>
            <View style={styles.horizontal}>
              <Text style={styles.text2}>Favourite Cafes:</Text>
            </View>
            <View style={styles.row} />
            <FlatList
              data={this.state.userData.favourite_locations}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Location', {location_id: item.location_id})}>
                <View style={{padding: 5}}>
                  <View style={styles.horizontal2}>
                    <Text style={styles.buttonText}>{item.location_name}</Text>
                    <Text style={styles.text3}>in {item.location_town}</Text>
                      <Image
                      style={styles.cafeLogo}
                     source={{ uri: item.photo_path }}
                    />           
                  </View>
                  <View style={styles.space} />
                  <Text style={styles.text4}>Overall Rating:</Text>
                  <AirbnbRating
                    defaultRating={item.avg_overall_rating}
                    size={18}
                    showRating={false}
                    isDisabled
                    selectedColor='#F87217'
                    unSelectedColor='#DDDDDD'
                  />
                  <View style={styles.horizontal3}>
                    <Text style={styles.text6}>Price Rating:</Text>
                    <Text style={styles.text6}>Quality Rating:</Text>
                    <Text style={styles.text6}>Cleanliness Rating:</Text>
                  </View>
                  <View style={styles.horizontal3}>
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
                  <View style={styles.row} />
                </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item)=> item.location_id.toString()}
            />
          </ImageBackground>
        </View>
      );
    
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:5,
  },
  horizontal3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  image: {
    flex: 1,
    resizeMode:'cover',
    height: 500,
  },
  cafeLogo:{
    flex: 1,
    height: 60,
    width: 60,
    position: 'absolute',
    right: 30,
  },
  container2: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  text4:{
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
    buttonText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
  },
  text2:{
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
    top: 4,
  },
  text6:{
    fontSize: 12,
    color: 'black',
    fontFamily: 'Roboto',
    alignItems: 'center',
  },
  space: {
    height: 5,
  },
  row: {
    padding: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
});
export default FavouriteCafes;