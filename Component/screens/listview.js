import React, { Component } from 'react';
import { ActivityIndicator, Text, StyleSheet, ScrollView, Image, ImageBackground, TouchableOpacity, View, ToastAndroid, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-elements'; 

class ListView extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      locations: null,
      offset: 0,
      q: '',
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      query: '',
      favourite: false,
      reviewed: false,
      search: false
    }
  }

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData("http://10.0.2.2:3333/api/1.0.0/find?limit=4&offset="+this.state.offset+"&");
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  getData = async (url) => {
    let token = await AsyncStorage.getItem('@token');
    return fetch(url,
    {
      headers: {
        'X-Authorization': token
      }
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
      locations: this.state.offset === 0 ? responseJson :
      [...this.state.locations, ...responseJson],
      isLoading: false,
    })
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

search = () => {
  this.setState({offset:0});
  let url = "http://10.0.2.2:3333/api/1.0.0/find?limit=4&offset=0&"
  let addquery = ""
  console.log(this.state.q);
  console.log(this.state.overall_rating);
  console.log(this.state.price_rating);
  console.log(this.state.quality_rating);
  console.log(this.state.clenliness_rating);

  if(this.state.q != ''){
    url += "q=" + this.state.q + "&";
    addquery += "q=" + this.state.q + "&";
  }

  if(this.state.overall_rating > 0){
    url += "overall_rating=" + this.state.overall_rating + "&";
    addquery += "overall_rating=" + this.state.overall_rating + "&";
  }

  if(this.state.price_rating > 0){
    url += "price_rating=" + this.state.price_rating + "&";
    addquery += "price_rating=" + this.state.price_rating + "&";
  }

  if(this.state.quality_rating > 0){
    url += "quality_rating=" + this.state.quality_rating + "&";
    addquery += "price_rating=" + this.state.price_rating + "&";
  }

  if(this.state.clenliness_rating > 0){
    url += "clenliness_rating=" + this.state.clenliness_rating + "&";
    addquery += "clenliness_rating=" + this.state.clenliness_rating + "&";
  }

  if(this.state.favourite === true){
    url += "search_in=favourite&";
    addquery += "search_in=favourite&";
  }

  if(this.state.reviewed === true){
    url += "search_in=reviewed&";
    addquery += "search_in=reviewed&";
  }
  console.log("query = "+addquery);
  this.setState({query:addquery})
  this.getData(url);
}

ratingCompleted(rating, name) {
  let stateObject = () => {
    let returnObj = {};
    returnObj[name] = rating;
    return returnObj;
  };
  this.setState( stateObject );
}

getMoreData = () =>{
  this.setState({offset:this.state.offset+4},
  ()=>this.getData("http://10.0.2.2:3333/api/1.0.0/find?limit=4&offset="+this.state.offset+"&"+this.state.query))
}

  render(){
    if(this.state.isLoading){
      return (
        <View style={styles.container2}>
          <Text  style={styles.text}> Loading... </Text>
          <ActivityIndicator size="large" color="#f87217" />
        </View>
      )
    } else if (this.state.search){
      return(
        <View style={styles.container3}>
          <ImageBackground
            source={require('./../../Images/Coffee_Cup(0.3).jpg')} style={styles.image}>
            <ScrollView>
              <Text style={styles.formLabel}>Search:</Text>
              <TextInput
                value={this.state.q}
                style={styles.formInput}
                placeholder="Search Here"
                onChangeText={(q) => this.setState({q: q})}
              />
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
              <View style={styles.horizontal}>
                <TouchableOpacity
                  style={styles.button3}
                  onPress={() => {this.setState({favourite:true})}}>
                  <Text style={styles.text5}>Only Favourites</Text>
                </TouchableOpacity>
                {this.state.favourite && (
                  <TouchableOpacity
                    style={styles.button3}
                    onPress={() => {this.setState({favourite:false})}}>
                    <Text style={styles.text5}>Unselect</Text>
                  </TouchableOpacity>
                )}
                {this.state.reviewed && (
                  <TouchableOpacity
                    style={styles.button3}
                    onPress={() => {this.setState({reviewed:false})}}>
                    <Text style={styles.text5}>Unselect</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.button3}
                  onPress={() => {this.setState({reviewed:true})}}>
                  <Text style={styles.text5}>Only Reviewed</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.space2} />
              <TouchableOpacity
                style={styles.button2}
                onPress={() => {this.search(),this.setState({search:false}), this.setState({isLoading: true})}}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              <View style={styles.space} />
              <TouchableOpacity
                style={styles.button2}
                onPress={() => {this.setState({search:false})}}>
                <Text style={styles.buttonText}>Go back</Text>
              </TouchableOpacity> 
            </ScrollView>
          </ImageBackground>
        </View>
      )  
    } else {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require('./../../Images/Coffee_Cup(0.3).jpg')} style={styles.image}>
            <View style={styles.horizontal}>
              <Text style={styles.text2}>Locations:</Text>
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => {this.setState({search:true})}}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row} />
            <FlatList
              data={this.state.locations}
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
                    isDisabled={true}
                    selectedColor='#F87217'
                    unSelectedColor='#DDDDDD'
                  />
                  <View style={styles.space} />
                  <View style={styles.row} />
                </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item)=> item.location_id.toString()}
              onEndReachedThreshold={0.5}
              onEndReached={this.getMoreData}
            />
          </ImageBackground>
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
    padding:5,
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
  container3: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(148, 199, 246)',
    padding:20,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(148, 199, 246)',
    padding: 5,
  },
  horizontal2: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 30,
  },
  text4:{
    fontSize: 20,
    color: 'black',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
    height: 28,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
  button3: {
    backgroundColor: 'rgba(248, 114, 23, 0.8)',
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
    textDecorationLine: 'underline',
    top: 4,
  },
  text3:{
    fontSize: 17,
    color: 'black',
    fontFamily: 'Roboto',
  },
  text5:{
    fontSize: 13,
    color: 'black',
    fontFamily: 'Roboto',
    padding: 3,
  },
  space: {
    height: 5,
  },
  space2:{
    height: 15,
  },
  row: {
    padding: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
});
export default ListView;