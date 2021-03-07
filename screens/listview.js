import React, { Component } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, ToastAndroid, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-elements'; 
import { Button } from 'react-native';

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
    this.getData("http://10.0.2.2:3333/api/1.0.0/find?limit=3&offset="+this.state.offset+"&");
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
      isLoading: false,

      locations: this.state.offset === 0 ? responseJson :
      [...this.state.locations, ...responseJson],

    })
  })
  .catch((error) => {
    console.error(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  })
}

search = () => {
  this.setState({offset:0});
  let url = "http://10.0.2.2:3333/api/1.0.0/find?limit=3&offset="+this.state.offset+"&"
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
      this.setState({
      offset:this.state.offset+3
      },()=>
      this.getData("http://10.0.2.2:3333/api/1.0.0/find?limit=3&offset="+this.state.offset+"&"+this.state.query))
}

  render(){
    if(this.state.isLoading){
      return (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )

    }else if (this.state.search){
      return(
       <View>
          <Text>Search</Text>
          <TextInput
            value={this.state.q}
            onChangeText={(q) => this.setState({q: q})}
          />
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


          <Button
            title="Fav?"
            onPress={() => {this.setState({favourite:true}), console.log("Favourite Pressed")}}
          />
          <Button
            title="Fav Off?"
            onPress={() => {this.setState({favourite:false}), console.log("Favourite Off")}}
          />
          <Button
            title="Reviewed?"
            onPress={() => {this.setState({reviewed:true}), console.log("Review On")}}
          />

          <Button
            title="Rev Off?"
            onPress={() => {this.setState({reviewed:false}), console.log("Rev Off")}}
          />

          <Button
            title="Search"
            onPress={() => {this.search(),this.setState({search:false})}}
          />

          <Button onPress={() =>  this.setState({search:false})} title="Go Back" />
       </View>
       )  
    }else{
      return (
        <View style={{flex:1}}>
           <Button
            title="Search"
            onPress={() => {this.setState({search:true})}}
          />

          <Text>Locations</Text>
          <FlatList

            data={this.state.locations}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Location', {location_id: item.location_id})}>
              <View style={{padding: 10}}>
                <Text>{item.location_name}</Text>
                <Text>{item.location_town}</Text>
                <Text>Overall Rating: {item.avg_overall_rating}</Text>
                <Text>Price Rating: {item.avg_price_rating}</Text>
                <Text>Quality Rating: {item.avg_quality_rating}</Text>
                <Text>Clenliness Rating: {item.avg_clenliness_rating}</Text>
              </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item)=> item.location_id.toString()}

            onEndReachedThreshold={0.5}
            onEndReached={this.getMoreData}
          />
        </View>
      );
    }
   
  }
}

export default ListView;

