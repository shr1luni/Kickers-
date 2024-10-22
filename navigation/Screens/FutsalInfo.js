import React from 'react';
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';

import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function FutsalInfo({navigation,route}) {
 
  const openMap = () => {
    const query = 'Dhukhu Futsal Hub'; // Change this to your desired search query
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query,
    )}`;
    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <View>
        <SwiperFlatList
          autoplay
          autoplayDelay={2}
          autoplayLoop
          index={2}
          showPagination>
          <View style={[styles.child]}>
            <ImageBackground
              source={require('../Screens/images/dhukhu2.jpg')}
              style={{height: 260, resizeMode: 'cover'}}
            />
          </View>
          <View style={[styles.child]}>
            <ImageBackground
              source={require('../Screens/images/dhukhu.jpg')}
              style={{height: 260, resizeMode: 'cover'}}
            />
          </View>
          <View style={[styles.child]}>
            <ImageBackground
              source={require('../Screens/images/dhukhu3.jpg')}
              style={{height: 260, resizeMode: 'cover'}}
            />
          </View>
          <View style={[styles.child]}>
            <ImageBackground
              source={require('../Screens/images/dhukhu4.jpg')}
              style={{height: 260, resizeMode: 'cover'}}
            />
          </View>
        </SwiperFlatList>
      </View>
      <ScrollView>
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: '#D9D9D9',
            height: 210,
          }}>
          <Text
            name="title"
            style={{
              color: 'black',
              fontSize: 20,
              fontWeight: 'bold',
              left: 15,
              top: 25,
            }}>
            {' '}
            Dhukhu Futsal Hub{' '}
          </Text>

          <View
            style={{
              borderWidth: 0,
              borderColor: 'blue',
              top: 35,
              height: 30,
              width: 220,
              left: 20,
              flexDirection: 'row',
            }}>
            <Icon
              name="clock-o"
              size={22}
              style={{color: 'grey', left: 10}}></Icon>
            <Text style={{color: 'black', left: 20, fontWeight: 'bold'}}>
              06:00 AM - 08:00 PM
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('PriceChart')}>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#D9D9D9',
                  left: 70,
                  width: 100,
                  top: -40,
                  height: 50,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    color: 'black',
                    alignSelf: 'center',
                    fontSize: 18,
                    top: 8,
                    fontWeight: 'bold',
                  }}>
                  Price
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 0,
              borderColor: 'blue',
              top: 40,
              height: 30,
              width: 320,
              left: 14,
              flexDirection: 'row',
            }}>
            <Icon
              name="home"
              size={20}
              style={{color: 'orange', left: 13}}></Icon>
            <Text style={{color: 'black', left: 23, fontWeight: 'bold'}}>
               Lamingtan Marg 4, Kathmandu 44600
            </Text>
          </View>
          <View
            style={{
              borderWidth: 0,
              borderColor: 'blue',
              top: 47,
              height: 30,
              width: 220,
              left: 20,
              flexDirection: 'row',
            }}>
            <Icon
              name="phone"
              size={22}
              style={{color: 'green', left: 10}}></Icon>
            <Text style={{color: 'black', left: 22, fontWeight: 'bold'}}>
              01-4535832
            </Text>
          </View>
          <TouchableOpacity onPress={openMap}>
            <View
              style={{
                borderWidth: 0,
                borderColor: '#7F7F7F',
                top: 50,
                height: 30,
                width: 120,
                left: 25,
                flexDirection: 'row',
              }}>
              <Image
                source={require('../Screens/images/mapg.png')}
                style={{
                  resizeMode: 'cover',
                  height: 20,
                  width: 20,
               
                  left: 4,
                }}
              />
              <Text
                style={{
                  color: 'black',
                  // alignSelf: 'center',
                  left: 15,
                  fontSize: 14,
                  fontWeight: 'bold',
                  // textDecorationLine:'underline'
                }}>
                Map
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderWidth: 0,
            borderColor: 'red',
            top: 0,
            height: 290,
            width: 390,
            flex:1,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              fontWeight: 'bold',
              left: 25,
              top: 15,
            }}>
            Amenities
          </Text>
          <View
            style={{
              borderWidth: 0,
              borderColor: 'blue',
              top: 25,
              height: 50,
              width:350,
              flexDirection: 'row',
              alignSelf:'center',
              justifyContent:'center',
              gap:20
            }}>
            <View
              style={{
                backgroundColor: '#D9D9D9',
                height: 30,
                width: 150,
                flexDirection:'row',
                alignSelf:'center',
                justifyContent:'center',
                gap:5,
                alignItems:'center'
              }}>
                <Image
                source={require('../../assets/pictures/parking-area.png')}
                style={{
                  resizeMode: 'cover',
                  height: 22,
                  width: 22,
                 
                }}/>
              <Text style={{color: 'black',alignSelf:'center',fontSize:13,top:3}}>Parking</Text>
            </View>
            <View
              style={{
                backgroundColor: '#D9D9D9',
                height: 30,
                width: 150,
                flexDirection:'row',
                alignSelf:'center',
                justifyContent:'center',
                gap:5,
                alignItems:'center'
              }}>
                <Image
                source={require('../../assets/pictures/shower.png')}
                style={{
                  resizeMode: 'cover',
                  height: 22,
                  width: 22,
                 
                }}/>
              <Text style={{color: 'black',alignSelf:'center',fontSize:13,top:3}}>Shower</Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0,
              borderColor: 'blue',
              top: 25,
              height: 50,
              width:350,
              flexDirection: 'row',
              alignSelf:'center',
              justifyContent:'center',
              gap:20
            }}>
            <View
              style={{
                backgroundColor: '#D9D9D9',
                height: 30,
                width: 150,
                flexDirection:'row',
                alignSelf:'center',
                justifyContent:'center',
                gap:5,
                alignItems:'center'
              }}>
                <Image
                source={require('../../assets/pictures/fast-food.png')}
                style={{
                  resizeMode: 'cover',
                  height: 22,
                  width: 22,
                 
                }}/>
              <Text style={{color: 'black',alignSelf:'center',fontSize:13,top:3}}>Restaurant</Text>
            </View>
            <View
              style={{
                backgroundColor: '#D9D9D9',
                height: 30,
                width: 150,
                flexDirection:'row',
                alignSelf:'center',
                justifyContent:'center',
                gap:5,
                alignItems:'center'
              }}>
                <Image
                source={require('../../assets/pictures/swimming.png')}
                style={{
                  resizeMode: 'cover',
                  height: 22,
                  width: 22,
                 
                }}/>
              <Text style={{color: 'black',alignSelf:'center',fontSize:13,top:3}}>Swimming</Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0,
              borderColor: 'blue',
              top: 25,
              height: 50,
              width:350,
              flexDirection: 'row',
              alignSelf:'center',
              justifyContent:'center',
              gap:20
            }}>
            <View
              style={{
                backgroundColor: '#D9D9D9',
                height: 30,
                width: 150,
                flexDirection:'row',
                alignSelf:'center',
                justifyContent:'center',
                gap:5,
                alignItems:'center'
              }}>
                <Image
                source={require('../../assets/pictures/treadmill.png')}
                style={{
                  resizeMode: 'cover',
                  height: 22,
                  width: 22,
                 
                }}/>
              <Text style={{color: 'black',alignSelf:'center',fontSize:13,top:3}}>Gym</Text>
            </View>
           
          </View>
         
          <TouchableOpacity onPress={() => navigation.navigate('BookFutsal')}>
            <View
              style={{
                height: 60,
                width: 160,
                borderWidth: 0,
                justifyContent: 'center',
                top: 45,
                alignSelf: 'center',
                backgroundColor: '#F95609',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                  
                }}>
                BOOK NOW!
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  child: {width, justifyContent: 'center'},
});
