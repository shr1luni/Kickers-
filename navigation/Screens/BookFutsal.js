import {
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function BookFutsal(props) {
  const {navigation, route} = props;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyNDQwMDUyMX0.lFgeymIuPBP3GG0GlUC31s-CHL2_ixqb62zO5u6aoKg';
  const [selectedDate, setSelectedDate] = useState('Select Date');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('Start Time');
  const [selectedEndTime, setSelectedEndTime] = useState('End Time');

  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleWalletSelect = wallet => {
    setSelectedWallet(wallet);
  };

  const [selectedRadio, setSelectedRadio] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = date => {
    const formattedDate = date.toLocaleDateString('en-CA'); // Formats to yyyy-mm-dd
    const finalFormattedDate = formattedDate.replace(/-/g, '/'); // Replace '-' with '/'
    setSelectedDate(finalFormattedDate);
    hideDatePicker();
  };

  const handleDateSelection = () => {
    // Show date picker modal when clicked again
    showDatePicker();
  };

  {
    /* time picker */
  }
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const showStartPicker = () => setStartPickerVisible(true);
  const hideStartPicker = () => setStartPickerVisible(false);
  const showEndPicker = () => setEndPickerVisible(true);
  const hideEndPicker = () => setEndPickerVisible(false);
  const formatTime = time => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleConfirmStartTime = date => {
    const isoTime = date.toISOString();
    const formattedTime = formatTime(date);
    setStartTime(isoTime);
    setSelectedStartTime(formattedTime);
    hideStartPicker();
  };

  const handleConfirmEndTime = date => {
    const isoTime = date.toISOString();
    const formattedTime = formatTime(date);
    setEndTime(isoTime);
    setSelectedEndTime(formattedTime);
    hideEndPicker();
  };
  // Function to calculate the duration in hours between two time strings
  const calculateHoursDifference = (startTime, endTime) => {
    // Parse the time strings to get the hour and minute components
    const startHour = parseInt(startTime.split(':')[0], 10);
    const startMinute = parseInt(startTime.split(':')[1], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    const endMinute = parseInt(endTime.split(':')[1], 10);

    // Adjust end time if it's before start time
    if (
      endHour < startHour ||
      (endHour === startHour && endMinute < startMinute)
    ) {
      endHour += 24; // Assuming end time is on the next day
    }

    // Calculate the difference in hours and minutes
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;

    // Adjust hours and minutes if necessary
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }

    // Calculate the total time difference in hours
    const totalTimeDifference = hours + minutes / 60;

    return totalTimeDifference;
  };
  const [bookingHours, setBookingHours] = useState(0);
  const handleBooking = () => {
    const hours = calculateHoursDifference(selectedStartTime, selectedEndTime);
    if (hours >= 0) {
      console.log('Total Hours:', hours);
      // Perform booking logic here
      setBookingHours(hours); // Store hours in component state
    } else {
      console.log('Invalid time selection');
    }
  };
  ///booking test


  useEffect(() => {
    console.log("Hello")
    const handleDeepLink = async (event) => {
      const { url } = event;
      const route = url.split('://')[1];
      const params = new URLSearchParams(route.split('?')[1]);

      if (route.startsWith('payments/verify-payment')) {
        console.log('Payment verification initiated');
        
        const paymentStatus = params.get('paymentStatus');
        const confirmation = params.get('confirmation');

        if (paymentStatus === 'Paid' && confirmation === 'Confirmed') {
          Alert.alert('Payment Successful', 'Your booking has been confirmed.');
          navigation.navigate('MainTabs'); // Navigate to the desired screen
        } else {
          Alert.alert('Payment Failed', 'Please try again.');
          navigation.navigate('BookScreen'); // Navigate back to booking screen
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [navigation]);
  

  const handleBookPress = async () => {
    if (
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime ||
      !selectedRadio
    ) {
      alert('Please fill out all fields.');
      return;
    }

    const futsalType = selectedRadio === 1 ? 'FiveA' : 'SevenA';
    const price = 1500;
    const data = {
      futsalId: 2,
      bookDate: selectedDate,
      startTime: startTime,
      endTime: endTime,
      type: futsalType,
      price: price,

      // Add any other fields required by your backend
    };

    const bookingUrl = 'http://192.168.43.19:8001/bookings';

    const paymentUrl = 'http://192.168.43.19:8001/payments';

    try {
      const response = await fetch(bookingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token here
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      if (response.ok) {
        const result = JSON.parse(responseText); // Parse if JSON is expected
        const data = {
          amount: 1500,
          bookingId: result.result.id,
        };
        console.log(result);
        const response2 = await fetch(paymentUrl + '/initialize-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token here
          },
          body: JSON.stringify(data),
        });
        const responseText2 = await response2.text();
        const result2 = JSON.parse(responseText2);
        Linking.openURL(result2.payment_url);
      } else {
        console.error('Booking Failed:', responseText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    // setIsConfirmationVisible(true); // Show confirmation message
    // setTimeout(() => {
    //   setIsConfirmationVisible(false); // Hide confirmation message after certain duration
    //   // navigation.navigate('MainTabs'); // Navigate to BookScreen
    // }, 3000); // 3000 milliseconds or 3 seconds
  };

  useEffect(() => {
    if (selectedStartTime !== 'Start Time' && selectedEndTime !== 'End Time') {
      handleBooking();
    }
  }, [selectedStartTime, selectedEndTime]);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
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
          Book A Game
        </Text>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: '#D9D9D9',
            top: 50,
            height: 120,
          }}>
          <Text style={{left: 30, top: 20, color: '#434343'}}>Slot Date</Text>
          <TouchableOpacity onPress={handleDateSelection}>
            <View style={[styles.datePickerContainer]}>
              <Text style={{top: 10, left: 15, color: '#434343'}}>
                {selectedDate}
              </Text>
              <Icon
                name="calendar"
                size={20}
                style={{
                  right: 10,
                  top: 10,
                  position: 'absolute',
                  color: '#434343',
                }}></Icon>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              minimumDate={new Date()} // This disables past dates
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: '#D9D9D9',
            top: 50,
            height: 120,
          }}>
          <Text style={{left: 30, top: 20, color: '#434343'}}>Slot Time</Text>
          <View
            style={{borderWidth: 0, top: 20, height: 70, flexDirection: 'row'}}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={showStartPicker}>
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#D9D9D9',
                  top: 0,
                  height: 50,
                  width: 150,
                  left: 30,
                  flexDirection: 'row',
                }}>
                <Text style={{top: 10, left: 15, color: '#434343'}}>
                  {selectedStartTime}
                </Text>
                <Icon
                  name="clock-o"
                  size={20}
                  style={{
                    right: 10,
                    top: 10,
                    position: 'absolute',
                    color: '#434343',
                  }}></Icon>
              </View>
              <DateTimePickerModal
                isVisible={isStartPickerVisible}
                mode="time"
                onConfirm={handleConfirmStartTime}
                onCancel={hideStartPicker}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={showEndPicker}>
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#D9D9D9',
                  top: 0,
                  height: 50,
                  width: 150,
                  left: 60,
                  flexDirection: 'row',
                }}>
                <Text style={{top: 10, left: 15, color: '#434343'}}>
                  {selectedEndTime}
                </Text>
                <Icon
                  name="clock-o"
                  size={20}
                  style={{
                    right: 10,
                    top: 10,
                    position: 'absolute',
                    color: '#434343',
                  }}></Icon>
              </View>
              <DateTimePickerModal
                isVisible={isEndPickerVisible}
                mode="time"
                onConfirm={handleConfirmEndTime}
                onCancel={hideEndPicker}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: '#D9D9D9',
            top: 50,
            height: 150,
          }}>
          <Text style={{left: 30, top: 20, color: '#434343'}}>Futsal Type</Text>
          <View
            style={{
              flexDirection: 'row',
              top: 30,
              borderWidth: 0,
              borderColor: 'red',
              height: 40,
              alignItems: 'center',
              left: 35,
            }}>
            <Text style={{color: '#434343', fontSize: 18}}>5a Side </Text>
            <TouchableOpacity onPress={() => setSelectedRadio(1)}>
              <View
                style={{
                  height: 25,
                  borderWidth: 2,
                  borderColor: 'black',
                  width: 25,
                  left: 20,
                  borderRadius: 25,
                }}>
                {selectedRadio == 1 ? (
                  <View
                    style={{
                      height: 18,
                      borderWidth: 0,
                      borderColor: 'black',
                      width: 18,
                      backgroundColor: '#F95609',
                      borderRadius: 18,
                      top: 1.5,
                      alignSelf: 'center',
                    }}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              top: 35,
              borderWidth: 0,
              borderColor: 'red',
              height: 40,
              alignItems: 'center',
              left: 35,
            }}>
            <Text style={{color: '#434343', fontSize: 18}}>7a Side</Text>
            <TouchableOpacity onPress={() => setSelectedRadio(2)}>
              <View
                style={{
                  height: 25,
                  borderWidth: 2,
                  borderColor: 'black',
                  width: 25,
                  left: 25,
                  borderRadius: 25,
                }}>
                {selectedRadio == 2 ? (
                  <View
                    style={{
                      height: 18,
                      borderWidth: 0,
                      borderColor: 'black',
                      width: 18,
                      backgroundColor: '#F95609',
                      borderRadius: 18,
                      top: 1.5,
                      alignSelf: 'center',
                    }}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: '#D9D9D9',
            top: 50,
            height: 200,
          }}>
          <View
            style={{borderWidth: 0, top: 0, height: 50, flexDirection: 'row'}}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                left: 20,
                top: 10,
                fontSize: 16,
              }}>
              Payment Method
            </Text>
            <View
              style={{
                borderWidth: 0,
                position: 'absolute',
                right: -10,
                height: 40,
                width: 200,
                flexDirection: 'row',
              }}>
              <TouchableOpacity>
                <Text
                  style={{
                    color: '#DE2A2A',
                    fontWeight: 'bold',
                    left: 20,
                    top: 10,
                    fontSize: 16,
                  }}>
                  View All Method
                </Text>
                <Icon
                  name="angle-right"
                  size={20}
                  style={{
                    color: '#DE2A2A',
                    position: 'absolute',
                    right: -35,
                    top: 12,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0,
              height: 120,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 20,
              marginTop: 5,
            }}>
            <TouchableOpacity
              style={[
                styles.walletButton,
                selectedWallet === 'eSewa' ? styles.selected : null,
              ]}
              onPress={() => handleWalletSelect('eSewa')}>
              <View
                style={{
                  borderWidth: 0,
                  borderColor: 'black',
                  height: 100,
                  width: 170,
                  top: 10,
                  justifyContent:'center',
                  gap:10
                }}>
                <Image
                  source={require('../Screens/images/esewa1.png')}
                  style={{
                    resizeMode: 'cover',
                    height: 35,
                    width: 35,
                    alignSelf: 'center',
                    // top: 10,
                  }}
                />
                <Text style={styles.walletText}>eSewa Mobile Wallet</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.walletButton,
                selectedWallet === 'Khalti' ? styles.selected : null,
              ]}
              onPress={() => handleWalletSelect('Khalti')}>
              <View
                style={{
                  borderWidth: 0,
                  borderColor: 'black',
                  height: 100,
                  width: 170,
                  top:10,
                  
                  justifyContent:'center'
                }}>
                <Image
                  source={require('../Screens/images/khalti.png')}
                  style={{
                    resizeMode: 'cover',
                    height: 50,
                    width: 50,
                    alignSelf: 'center',
                  }}
                />
                <Text style={styles.walletText}>Khalti Mobile Wallet</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
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
          <View
            style={{borderWidth: 0, top: 30, height: 40, flexDirection: 'row'}}>
            <Text style={{color: 'black', left: 20, top: 5}}>
              Per Hour Rate
            </Text>
            <Text
              style={{color: 'black', right: 20, top: 5, position: 'absolute'}}>
              NPR 1500
            </Text>
          </View>
          <View
            style={{borderWidth: 0, top: 30, height: 40, flexDirection: 'row'}}>
            <Text style={{color: 'black', left: 20, top: 5}}>Total Amount</Text>
            <Text
              style={{color: 'black', right: 20, top: 5, position: 'absolute'}}>
              {bookingHours} x 1500={bookingHours * 1500}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: '#D9D9D9',
            top: 50,
            height: 150,
          }}>
          <View
            style={{
              borderWidth: 0,
              top: 0,
              height: 80,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 120,
            }}>
            <Text
              style={{
                color: 'black',
                // left: 20,
                // top: 5,
                // position: 'absolute',
                fontSize: 18,
              }}>
              NPR {bookingHours * 1500}
            </Text>
            <TouchableOpacity onPress={handleBookPress}>
              <View
                style={{
                  height: 60,
                  width: 160,
                  borderWidth: 0,
                  top: 10,
                  justifyContent: 'center',
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
                  BOOK
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {isConfirmationVisible && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>
            Your booking is completed. Have Fun!!
          </Text>
        </View>
      )}
    </View>
  );
}
const styles = {
  datePickerContainer: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    top: 25,
    height: 50,
    width: 330,
    left: 30,
    flexDirection: 'row',
  },
  confirmationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmationText: {
    color: 'white',
    fontSize: 16,
  },
  walletButton: {
    // padding: 20,
    borderRadius: 10,
    backgroundColor: '#D3D3D3', // Default background color
  },
  selected: {
    backgroundColor: '#ADD8E6', // Selected background color
  },
  walletText: {
    color: '#fff',
    alignSelf:'center'
  },
};
