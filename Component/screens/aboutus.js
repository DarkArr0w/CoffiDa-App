import React, { Component } from 'react';
import {Image, Text, View, StyleSheet } from 'react-native';

class AboutUs extends Component{
  render(){
    const nav = this.props.navigation;
    return(
      <View style={styles.container}>
      <View style={styles.space} />
      <Text style={styles.text2}>  
      Welcome to CoffiDa!
      </Text>
      <View style={styles.space} />
      <Text style={styles.text}>  
      CoffiDa is platform for finding and reviewing the best local coffee shops.{"\n"}{"\n"}
      Users who sign up for an account can publish their own reviews for other to see.{"\n"}{"\n"}
      Reviews consist of a series of ratings (quality, price, cleanliness) along with a short body of text for describing their 
      personal experience and can also be given a 'like'.
      </Text>
      <View style={styles.space2} />
      <Image source={require('./../../Images/cup_logo.jpg')} style={styles.image2}/>
      <Text style={styles.text3}>  
      Concept created by: Ashley Williams{"\n"}{"\n"}
      App created by: Lewis Schofield{"\n"}{"\n"}
      Images created by: @ellexarts
      </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(133, 201, 250)',
    padding: 20,
    paddingTop: 95,
  },
  image2: {
    width: 150,
    height: 150,
    left: 80,
    top: -115,
  },
  text:{
    fontSize: 13,
    color: 'black',
    padding: 3,
    fontFamily: 'Roboto',
    top: -80,
  },
  text2:{
    fontSize: 16,
    color: 'black',
    padding: 3,
    fontFamily: 'Roboto',
    textAlign: 'center',
    top: -80,
    textDecorationLine: 'underline',
  },
  text3:{
    fontSize: 12,
    color: 'black',
    padding: 3,
    fontFamily: 'Roboto',
    top: -80,
  },
  space: {
    height: 0,
  },
  space2: {
    height: 40,
  },
});

export default AboutUs;