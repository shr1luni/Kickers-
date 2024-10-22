import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SectionHeader,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TopFutsalCarousel from './TopFutsalCarousel';
import {TOP_FUTSAL, TOP_GAME} from '../data/constList';
import TopGameCarousel from './TopGameCarousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SERVER_URL} from '@env'


export default function HomeScreen(props) {
  const {route,navigation}=props;
  const [user, setUser] = useState(null);
  const [futsalData, setFutsalData] = useState([]);
  const { token } = route.params;
  const getData = async () => {
    
    try {
      
      const response = await fetch('http://192.168.43.19:8001/getFutsals', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFutsalData(data)
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#E6E6E6',
        // height: 1000,
      }}>
      <ScrollView>
        <View
          style={{
            borderRadius: 10,
            height: 160,
            width: 340,
            borderWidth: 0,
            alignSelf: 'center',
            top: 20,
            backgroundColor: '#FEFEFE',
          }}>
          <View style={{flexDirection: 'row', width: 340, height: 20}}>
            <View
              style={{
                backgroundColor: '#F3F3F3',
                width: 100,
                left: 20,
                top: 20,
                height: 25,
                justifyContent: 'center',
              }}>
              <Text style={{color: 'black', alignSelf: 'center', fontSize: 10}}>
                START PLAYING!
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateGameScreen',{token})}>
              <View
                style={{
                  borderWidth: 1,
                  left: 130,
                  height: 40,
                  top: 30,
                  width: 90,
                  // alignItems: 'center',
                  justifyContent:"center",
                 
                  paddingVertical: 2,
                  borderRadius: 10,
                }}>
                <Text style={{color: 'black',alignSelf:'center'}}>Create</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <View
              style={{
                width: 110,
                left: 20,
                top: 30,
                height: 25,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Create Game
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 115,
              left: 22,
              top: 30,
              height: 25,
              justifyContent: 'center',
            }}>
            <Text style={{color: 'black', alignSelf: 'center', fontSize: 10}}>
              Find opponent near you
            </Text>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity onPress={() => navigation.navigate('Play')}>
            <Text
              style={{
                color: 'black',
                alignSelf: 'center',
                top: 30,
                textDecorationLine: 'underline',
              }}>
              View My Schedule
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 30,
            width: 340,
            left: 22,
            top: 40,
            flexDirection: 'row',
          }}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            Book A Futsal Nearby
          </Text>
          <TouchableOpacity
            style={{left: 110, flexDirection: 'row'}}
            onPress={() => navigation.navigate('Book')}>
            <Text style={{color: '#08C208'}}>SEE ALL</Text>
            <Icon
              name="angle-right"
              size={20}
              style={{color: '#08C208', left: 5}}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{top: 40, borderColor: 'black', borderRadius: 2, height: 350}}>
          <TopFutsalCarousel list={TOP_FUTSAL} navigation={navigation} />
        </ScrollView>
        <View
          style={{
            borderWidth: 0,
            borderColor: 'black',
            height: 30,
            width: 340,
            left: 22,
            top: -80,
            flexDirection: 'row',
          }}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            Join A Game Nearby
          </Text>
          <TouchableOpacity
            style={{left: 110, flexDirection: 'row'}}
            onPress={() => navigation.navigate('Play')}>
            <Text style={{color: '#08C208'}}>SEE ALL</Text>
            <Icon
              name="angle-right"
              size={20}
              style={{color: '#08C208', left: 5}}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={{top: -80, borderWidth: 0, borderColor: 'black'}}>
          <TopGameCarousel list={TOP_GAME} />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  line: {
    borderBottomColor: '#F1E8E8',
    borderBottomWidth: 1,
    width: '100%',
    height: 20,
    top: 20,
  },
});
