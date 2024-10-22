import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TOP_BOOKING, BOOKINGS} from '../data/constList';
import BookingList from './BookingList';

export default function Booking({navigation,token}) {
  const [searchText, setSearchText] = useState('');
  

  const handleClearInput = () => {
    setSearchText('');
  };
  return (
    <View style={{flex: 1, backgroundColor: '#E6E6E6'}}>
      <View
        style={{
          borderBottomWidth: 2,
          borderColor: '#D9D9D9',
          backgroundColor: '#F3F3F3',
          borderRadius: 6,
          height: 130,
          width: 400,
          alignSelf: 'center',
          top: 0,
          flexDirection: 'row',
        }}>
        <View
          style={{
            borderWidth: 0,
            backgroundColor: '#FEFEFE',
            borderRadius: 6,
            height: 100,
            width: 350,
            alignSelf: 'center',
            left: 20,
            flexDirection: 'row',
          }}>
          <TouchableOpacity>
            <View
              style={{
                borderWidth: 2,
                borderColor: '#7F7F7F',
                height: 40,
                width: 40,
                left: 20,
                top: 25,
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Image
                source={require('../Screens/images/sort.png')}
                style={{height: 20, width: 20, resizeMode: 'cover', top: 7}}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              left: 40,
              borderWidth: 2,
              borderColor: '#D9D9D9',
              width: 250,
              alignSelf: 'center',
              flexDirection: 'row',
              borderRadius: 10,
              backgroundColor: '#F3F3F3',
              height: 40,
              top: -5,
            }}>
            <TextInput
              value={searchText}
              onChangeText={text => setSearchText(text)}
              placeholder="Search By Futsal Name"
              placeholderTextColor={'#000000'}
              style={{
                color: 'black',
                width: 290,
                borderColor: 'black',
                borderWidth: 0,
                paddingLeft: 15,
                fontSize: 12,
              }}
            />
            {searchText ? (
              <TouchableOpacity onPress={handleClearInput}>
                <Icon
                  name="times-circle"
                  size={20}
                  style={{color: '#8D8A8A', left: 10, top: 15}}></Icon>
              </TouchableOpacity>
            ) : (
              <Icon
                name="search"
                size={18}
                style={{color: '#8D8A8A', left: -70, top: 8}}
              />
            )}
          </View>
        </View>
      </View>
      <View style={{flex: 1, top: 10}}>
        <BookingList navigation={navigation} list={BOOKINGS} />
      </View>
    </View>
  );
}
