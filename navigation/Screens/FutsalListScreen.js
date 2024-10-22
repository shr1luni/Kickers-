import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  
} from 'react-native';
import React,{useEffect,useState} from 'react';
import {sizes, spacing, shadow, colors} from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const CARD_WIDTH = sizes.width - 80;
const CARD_HEIGHT = 200;
const CARD_WIDTH_SPACING = CARD_WIDTH + spacing.l;

export default function FutsalListScreen(props) {
  const {list,navigation,route}=props;
  
  


  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const isFavorite = (id) => favorites.includes(id);
  return (
    <FlatList
      data={list}
    
      snapToInterval={CARD_WIDTH_SPACING}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      keyExtractor={i => i.id}
      style={{borderWidth:0,borderColor:'red',flex:1,marginBottom:70}}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          
          <TouchableOpacity  onPress={() => navigation.navigate('FutsalInfo')}
            style={{
              marginLeft: spacing.l,
              marginRight: index === list.length - 1 ? spacing.l : 0,
             
            }}>
            <View style={[styles.card, shadow.dark]}>
            <TouchableOpacity
                style={[styles.favourite, isFavorite(item.id) ]}
                onPress={() => toggleFavorite(item.id)}>
                <Icon
                  name={isFavorite(item.id) ? 'heart' : 'heart-o'}
                  size={22}
                  color={isFavorite(item.id) ? '#FF3040' : 'white'}
                />
              </TouchableOpacity>
              <View style={styles.imageBox}>
              <Image source={item.image} style={styles.image} />
              </View>
              <View style={styles.titleBox}>
                <Text style={styles.title}>{item.title}</Text>
               

                <Text style={styles.location}><Icon name="map-marker" size={12} color={'orange'} style={{left:10}} />{item.location}</Text>
                <View style={{flexDirection: 'row', top: 3, marginBottom: 4}}>
                  <Image
                    source={require('../Screens/images/stars.png')}
                    style={{height: 10, width: 10, resizeMode: 'cover'}}
                  />
                  <Image
                    source={require('../Screens/images/stars.png')}
                    style={{height: 10, width: 10, resizeMode: 'cover'}}
                  />
                  <Image
                    source={require('../Screens/images/stars.png')}
                    style={{height: 10, width: 10, resizeMode: 'cover'}}
                  />
                  <Image
                    source={require('../Screens/images/stars.png')}
                    style={{height: 10, width: 10, resizeMode: 'cover'}}
                  />
                </View>

                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
       
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 220,
    marginVertical: 10,
    
  },
  imageBox: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: sizes.radius,
    overflow: 'hidden',
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    resizeMode: 'cover',
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
  favourite:{
    borderWidth:0,
    borderColor:'red',
    zIndex:4,
    alignItems:'center',
    height:25,
    top:40,
    width:30,
    alignSelf:'flex-end',
    right:10
  },
 
});
