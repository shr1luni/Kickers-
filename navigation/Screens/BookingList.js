import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {sizes, spacing, shadow, colors} from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const CARD_WIDTH = sizes.width - 80;
const CARD_HEIGHT = 200;
const CARD_WIDTH_SPACING = CARD_WIDTH + spacing.l;

export default function BookingList({list, navigation}) {
  return (
    <FlatList
      data={list}
      snapToInterval={CARD_WIDTH_SPACING}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      keyExtractor={i => i.id}
      style={{borderWidth: 0, borderColor: 'red', flex: 1, marginBottom: 70}}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          <View style={[styles.card, shadow.dark]}>
            <View
              style={{
                flexDirection: 'row',
                borderWidth: 0,
                flex: 2,
                top: 20,
                justifyContent: 'center',
                gap: 0,
              }}>
              <View
                style={{
                  borderWidth: 0,
                  borderColor: 'red',
                  flex: 8,

                  left: 15,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="map-marker" size={20} style={{color: 'black'}} />
                  <Text style={{color: 'black', left: 10}}>{item.title}</Text>
                </View>
                <View style={{flexDirection: 'row', top: 10}}>
                  <Icon name="calendar" size={15} style={{color: 'black'}} />
                  <Text style={{color: 'black', left: 4}}>{item.date}</Text>
                </View>
                <View style={{flexDirection: 'row', top: 20}}>
                  <Icon name="clock-o" size={19} style={{color: 'black'}} />
                  <Text style={{color: 'black', left: 7}}>{item.time}</Text>
                </View>
                <View style={{flexDirection: 'row', top: 30}}>
                  <Image
                    source={require('../Screens/images/field.png')}
                    style={{height: 18, width: 19, resizeMode: 'cover'}}
                  />
                  <Text style={{color: 'black', left: 5}}>{item.type}</Text>
                </View>
                <View style={{flexDirection: 'row', top: 40}}>
                  <Text style={{color: 'black'}}>Booking Status:</Text>
                  <Text style={{color: 'black', left: 2, fontWeight: 'bold'}}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('BookingDetails')}>
                  <Image
                    source={require('../Screens/images/angle-right.png')}
                    style={{height: 20, width: 20}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity style={{width:100,alignSelf:'center'}}>
                <View
                  style={{
                    borderWidth: 0,
                    borderRadius: 10,
                    height: 40,
                   
                    alignSelf: 'center',
                    justifyContent:'center',
                    width: 100,
                    backgroundColor: '#C11919',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 'bold',
                     
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
}
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 250,
    marginVertical: 10,
    backgroundColor: '#FEFEFE',
    borderRadius: 16,
    alignSelf: 'center',
    gap: 45,
  },

  titleBox: {
    position: 'absolute',
    top: CARD_HEIGHT - 80,
    left: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  location: {
    fontSize: 10,
    color: colors.white,
  },
  description: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
    //
  },
});
