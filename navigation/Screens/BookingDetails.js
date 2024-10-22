import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function BookingDetails({navigation}) {
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../Screens/images/left.png')}
          style={{
            height: 30,
            width: 30,
            left: 15,
            top: 20,
            resizeMode: 'cover',
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          color: 'black',
          fontSize: 26,
          fontWeight: 'bold',
          left: 25,
          top: 45,
        }}>
        Booking Details
      </Text>
      <View
        style={{
          borderWidth: 2,
          borderColor: '#D9D9D9',
          top: 60,
          height: 190,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              borderWidth: 0,
              borderColor: 'red',
              height: 150,
              width: 170,
              left: 20,
              top: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="map-marker" size={20} style={{color: 'black'}} />
              <Text style={{color: 'black', left: 10}}>Shankhamul Futsal</Text>
            </View>
            <View style={{flexDirection: 'row', top: 10}}>
              <Icon name="calendar" size={20} style={{color: 'black'}} />
              <Text style={{color: 'black', left: 10}}>10 Mar, 2024</Text>
            </View>
            <View style={{flexDirection: 'row', top: 20}}>
              <Icon name="clock-o" size={20} style={{color: 'black'}} />
              <Text style={{color: 'black', left: 10}}>09:00AM-10:00AM</Text>
            </View>
            <View style={{flexDirection: 'row', top: 30}}>
              <Image
                source={require('../Screens/images/field.png')}
                style={{height: 20, width: 20, resizeMode: 'cover'}}
              />
              <Text style={{color: 'black', left: 10}}>5a side</Text>
            </View>
            <View style={{flexDirection: 'row', top: 40}}>
              <Text style={{color: 'black'}}>Booking Status:</Text>
              <Text style={{color: 'white', left: 10,backgroundColor:'green',width:75,borderRadius:2}}>
                Confirmed
              </Text>
            </View>
          </View>
         
        </View>
        {/* end */}
        <View style={{
         borderBottomWidth: 2,
         borderColor: '#D9D9D9',
         top: 50,
         height: 150,
      }}>
         <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              left: 20,
              top: 10,
              fontSize: 16,
            }}>
            Bill Summary
          </Text>
          <View style={{borderWidth:0,top:30,height:40,flexDirection:'row'}}>
            <Text style={{color:'black',left:20,top:5}}>Per Hour Rate</Text>
            <Text style={{color:'black',right:20,top:5,position:'absolute'}}>NPR 1500</Text>
          </View>
          <View style={{borderWidth:0,top:30,height:40,flexDirection:'row'}}>
            <Text style={{color:'black',left:20,top:5}}>Total Amount</Text>
            <Text style={{color:'black',right:20,top:5,position:'absolute'}}> 2 x 1500=3000</Text>
          </View>
         

      </View>
      <Text style={{color:'black',left:280,top:50,fontSize:18}}>NPR 3000</Text>
   
      <TouchableOpacity>
          <View
            style={{
              height: 40,
              width: 100,
              borderWidth: 0,
              top: 105,
             alignSelf:'center',
              
              backgroundColor: '#C11919',
              borderRadius: 10,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold',
                top: 10,
              }}>
              Cancel
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
