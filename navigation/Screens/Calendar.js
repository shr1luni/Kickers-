import {View, Text} from 'react-native';
import React from 'react';
import FutsalListScreen from './FutsalListScreen';
import {TOP_BOOKING, TOP_FUTSAL} from '../data/constList';
import UpcomingBook from './UpcomingBook';

export default function Calendar() {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          borderBottomWidth: 2,
          borderColor: '#D9D9D9',
          height: 90,
          flexDirection: 'row',
          backgroundColor: '#FEFEFE',
        }}>
        <View
          style={{
            borderWidth: 0,
            borderRadius: 10,
            width: 100,
            top: 20,
            left: 20,
            height: 50,
            backgroundColor: '#08C208',
          }}>
          <Text
            style={{
              color: 'white',
              alignSelf: 'center',
              fontWeight: 'bold',
              top: 12,
            }}>
            Upcoming
          </Text>
        </View>
    
      </View>
      <View style={{flex: 1, backgroundColor: '#E6E6E6', borderWidth: 0}}>
        <UpcomingBook list={TOP_BOOKING} />
      </View>
    </View>
  );
}
