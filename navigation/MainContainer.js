import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PriceChart from './Screens/PriceChart';


//Screens
import HomeScreen from './Screens/HomeScreen';
import BookScreen from './Screens/BookScreen';
import PlayScreen from './Screens/PlayScreen';
import ProfileScreen from './Screens/ProfileScreen';
import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import FutsalInfo from './Screens/FutsalInfo';
import BookFutsal from './Screens/BookFutsal';
import CreateGameScreen from './Screens/CreateGameScreen';
import BookingDetails from './Screens/BookingDetails';
import RolesScreen from './Screens/RolesScreen'
import FutsalListScreen from './Screens/FutsalListScreen';
import Booking from './Screens/Booking';
import { BOOKINGS } from './data/constList';
import Calendar from './Screens/Calendar';

import FutsalRegistrationScreen from '../FutsalScreen/FutsalRegistrationScreen';
import FutsalBookingsScreen from '../FutsalScreen/FutsalBookingsScreen';
import FutsalSlotScreen from '../FutsalScreen/FutsalSlotScreen';
import FutsalProfileScreen from '../FutsalScreen/FutsalProfileScreen';
import EditProfileScreen from './Screens/EditProfileScreen';

const {width, height} = Dimensions.get('window');
//for bottom tab navigation
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



export default function MainContainer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for SplashScreen
    setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Adjust the timeout as needed
  }, []);

  if (isLoading) {
    return <SplashScreenWithImage />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: props => <CustomHeader {...props} />,
          headerStyle: {
            backgroundColor: '#FEFEFE', // Customize your header background color
          },
        }}>
          <Stack.Screen
          name="RolesScreen"
          component={RolesScreen}
          options={{headerShown: false}}

        />

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}

        />

        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
          options={{headerShown: false}}
        />
       

       <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="FutsalInfo" component={FutsalInfo} options={{ headerShown: false }} />
        <Stack.Screen name="PriceChart" component={PriceChart} options={{ headerShown: false }} />
        <Stack.Screen name="BookFutsal"  component={BookFutsal} options={{ headerShown: false }} />
    
        <Stack.Screen name="CreateGameScreen" component={CreateGameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BookingDetails" list={BOOKINGS} component={BookingDetails} options={{ headerShown: false }} />

        <Stack.Screen name="FutsalRegistration"  component={FutsalRegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="FutsalScreens" component={FutsalScreens} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//splash screen

function SplashScreenWithImage() {
  return (
    
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DDDEE4',
      }}>
      <Image
        source={require('../assets/pictures/logo.png')}
        style={{
          justifyContent: 'center',
          left: 5,
          right: 5,
          top: -10,
          height: 70,
          width: 300,
        }}
      />
      <Image
        source={require('../assets/pictures/kickboy1.png')}
        style={{
          width: 350,
          height: 300,
          top: 20,
          right: 10,
          justifyContent: 'center',
        }}
      />
      <Text style={{top: 30, justifyContent: 'center', color: 'black'}}>
        {' '}
        Book Your Futsal Fun Now!
      </Text>
    </SafeAreaView>
  );
}

// header function
function CustomHeader({navigation}) {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/pictures/logo.png')} // Add your logo image
        style={styles.logo}
      />

      <View style={styles.mid}>
        <Image
          source={require('../assets/pictures/marker.png')} // marker icon image
          style={styles.marker}
        />
        <Text style={{fontSize: 12, left: 2, color: 'black'}}>
          Putalisadak,Kathmandu..
        </Text>
        <TouchableOpacity>
          <Image
            source={require('../assets/pictures/angledown.png')} // angle down icon image
            style={styles.arrowdown}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity >
        <Image
          source={require('../assets/pictures/bell.png')} // Add your notification icon image
          style={styles.notificationIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

//function bottom
function MainTabs({route}) {
  const {token}=route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FEFEFE',
          bottom: 1,
          height: 65,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ token }}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/pictures/home.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  bottom: 5,
                  tintColor: focused ? 'orange' : '#748c94',
                }}
              />
              <Text
                style={{
                  color: focused ? 'orange' : '#748c94',
                  fontSize: 16,
                  bottom: 5,
                }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Book"
        component={BookScreen}
        initialParams={{ token }}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/pictures/field.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  bottom: 5,
                  tintColor: focused ? 'orange' : '#748c94',
                }}
              />
              <Text
                style={{
                  color: focused ? 'orange' : '#748c94',
                  fontSize: 16,
                  bottom: 5,
                }}>
                Book
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Play"
        component={PlayScreen}
        initialParams={{ token }}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/pictures/users.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  bottom: 5,
                  tintColor: focused ? 'orange' : '#748c94',
                }}
              />
              <Text
                style={{
                  color: focused ? 'orange' : '#748c94',
                  fontSize: 16,
                  bottom: 5,
                }}>
                Play
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={ProfileScreen}
        initialParams={{ token }}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/pictures/circle-user.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  bottom: 5,
                  tintColor: focused ? 'orange' : '#748c94',
                }}
              />
              <Text
                style={{
                  color: focused ? 'orange' : '#748c94',
                  fontSize: 16,
                  bottom: 5,
                }}>
                User
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

 const FutsalScreens=({ route })=>{
  const { futsalId,token } = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FEFEFE',
          bottom: 1,
          height: 65,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Bookings"
        component={FutsalBookingsScreen}
        initialParams={{ futsalId,token }}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/pictures/book.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  bottom: 5,
                  tintColor: focused ? 'orange' : '#748c94',
                }}
              />
              <Text
                style={{
                  color: focused ? 'orange' : '#748c94',
                  fontSize: 16,
                  bottom: 5,
                }}>
                Bookings
              </Text>
            </View>
          ),
        }}
      />
       <Tab.Screen
        name="Slot"
        component={FutsalSlotScreen}
        initialParams={{ futsalId,token }}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/pictures/clock.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  bottom: 5,
                  tintColor: focused ? 'orange' : '#748c94',
                }}
              />
              <Text
                style={{
                  color: focused ? 'orange' : '#748c94',
                  fontSize: 16,
                  bottom: 5,
                }}>
                Slots
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={FutsalProfileScreen}
        initialParams={{ futsalId,token }}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: 10,
              }}>
              <Image
                source={require('../assets/pictures/circle-user.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  bottom: 5,
                  tintColor: focused ? 'orange' : '#748c94',
                }}
              />
              <Text
                style={{
                  color: focused ? 'orange' : '#748c94',
                  fontSize: 16,
                  bottom: 5,
                }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
 }
//style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Set your desired background color
  },
  image: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Customize your header bottom border color
    backgroundColor: '#FEFEFE',
  },
  logo: {
    width: 72, // Adjust the width of your logo
    height: 16, // Adjust the height of your logo
  },
  notificationIcon: {
    width: 20, // Adjust the width of your notification icon
    height: 20, // Adjust the height of your notification icon
  },
  mid: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    left: 30,
  },
  marker: {
    flexDirection: 'row',
    width: 14,
    height: 14,
  },
  arrowdown: {
    width: 14,
    height: 14,
  },
});
