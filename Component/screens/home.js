import React, { Component } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity,  StyleSheet, PermissionsAndroid, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

async function requestLocationPermission(){
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'This app requires access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can access location');
      return true;
    }else{
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

class Home extends Component{

  constructor(props){
    super(props);

    this.state = {
      location: null,
      locations: null,
      locationPermission: false,
      isLoading: true
    }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkToken();
      this.findCoordinates();
      this.getData();
    });
  }

  checkToken = async () => {
    const token = await AsyncStorage.getItem('@token');
    if (token == null) {
      this.props.navigation.navigate('HomeMenu');
    }
  };

  findCoordinates(){
    console.log("state", this.state);
    if(!this.state.locationPermission){
      console.log("asking for permission...");
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition((position) => {
      const location = position;
      console.log("LOCATION 1: ", location.coords);
      this.setState({location: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      }});
      this.setState({isLoading: false});
    }, (error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    });
  }

  getData = async () => {
    let token = await AsyncStorage.getItem('@token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/find",
    {
      headers: {
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
        locations: responseJson
      })
    })
    .catch((error) => {
      console.error(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  render(){
    const nav = this.props.navigation;
    if(this.state.isLoading){
      return (
        <View style={styles.container}>
          <Text  style={styles.text}> Loading... </Text>
          <ActivityIndicator size="large" color="#f87217" />
        </View>
      )
    }else{
      console.log("LOCATION 2: ", this.state.location);
      return (
        <View style={{flex:1}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex:1}}
            region={{
              latitude:this.state.location.latitude,
              longitude: this.state.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
          >
            <Marker
              coordinate={this.state.location}
              title="My location"
              description="Here you are"
            />
          </MapView>
          <View style={styles.horizontal}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => nav.navigate('ListView')}>
              <Text style={styles.buttonText}>List View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => nav.navigate('Logout')}>
              <Text style={styles.buttonText}>Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: 'rgb(148, 199, 246)',
    padding: 10,
  },
  button: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    width: 125,
    padding: 8,
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
  space: {
    height: 15,
    width: 15,
  },
});
export default Home;