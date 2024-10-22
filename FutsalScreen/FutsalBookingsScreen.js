import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const BookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [bookings, setBookings] = useState([
    {
      id: '1',
      date: '2024-09-01',
      name: 'Sarowar Malla',
      typeName: '5A Side',
      phoneNumber: '9812342123',
      amount: 'RS 1700',
      time: '07:00 PM-08:00 PM',
    },
    {
      id: '2',
      date: '2024-09-01',
      name: 'Nayandeep Shrestha',
      typeName: '5A Side',
      phoneNumber: '9801232123',
      amount: 'Rs 3400',
      time: '02:00 PM-04:00 PM',
    },
    {
      id: '3',
      date: '2024-09-02',
      name: 'Asis Shrestha',
      typeName: '5A Side',
      phoneNumber: '976212534',
      amount: '1200',
      time: '10:00 AM-11:00 AM',
    },
    {
      id: '4',
      date: '2024-09-03',
      name: 'Rajat Shrestha',
      typeName: '5A Side',
      phoneNumber: '9871234123',
      amount: '1200',
      time: '09:00 AM-10:00 AM',
    },
    {
      id: '5',
      date: '2024-09-03',
      name: 'Anil Shah',
      typeName: '5A Side',
      phoneNumber: '9812341234',
      amount: '1700',
      time: '07:00 PM-08:00 PM',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const isWithinRange = (bookingTime, startTime, endTime) => {
    const [bookingStart, bookingEnd] = bookingTime
      .split('-')
      .map(time => parseTime(time.trim()));
    const [start, end] = [parseTime(startTime), parseTime(endTime)];
    return bookingStart >= start && bookingEnd <= end;
  };

  const parseTime = time => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = time => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const filteredBookings = bookings.filter(
    booking =>
      booking.date === selectedDate &&
      (!startTime ||
        !endTime ||
        isWithinRange(booking.time, startTime, endTime)),
  );

  const deleteBooking = id => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            setBookings(bookings.filter(booking => booking.id !== id)),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {selected: true, marked: true, selectedColor: '#F95609'},
        }}
      />
      <View>
        <View style={{borderTopWidth: 1, borderColor: '#ddd'}}>
          <TouchableOpacity
            style={{
              borderWidth: 0,
              marginTop: 10,
              borderRadius: 10,
              width: 50,
              alignSelf: 'flex-end',
              marginRight: 20,
              justifyContent: 'center',
              backgroundColor: '#F95609',
            }}
            onPress={() => setModalVisible(true)}>
            <View
              style={{
                flexDirection: 'row-reverse',
                gap: 5,
                alignSelf: 'center',
              }}>
              <Icon name="filter" size={30} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{color: 'black'}}>Select Start Time:</Text>
            <TouchableOpacity onPress={() => setStartPickerVisible(true)}>
              <Text style={styles.modalTime}>{startTime || 'Select Time'}</Text>
            </TouchableOpacity>
            <Text style={{color: 'black'}}>Select End Time:</Text>
            <TouchableOpacity onPress={() => setEndPickerVisible(true)}>
              <Text style={styles.modalTime}>{endTime || 'Select Time'}</Text>
            </TouchableOpacity>
            <Button
              title="Apply Filter"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        onConfirm={time => {
          setStartTime(formatTime(time));
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        onConfirm={time => {
          setEndTime(formatTime(time));
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />

      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.bookingItem}>
            <View>
              <Text style={styles.bookingName}>{item.name}</Text>
              <Text style={styles.bookingDetails}>Time: {item.time}</Text>
              <Text style={styles.bookingDetails}>Type: {item.typeName}</Text>
              <Text style={styles.bookingDetails}>
                Phone: {item.phoneNumber}
              </Text>
              <Text style={styles.bookingDetails}>Amount: {item.amount}</Text>
            </View>
            <View style={styles.cancel}>
              <TouchableOpacity onPress={() => deleteBooking(item.id)}>
                <View style={styles.cancel}>
                  <Text
                    style={{
                      color: 'white',
                      alignSelf: 'center',
                      fontWeight: 'bold',
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noBookings}>No bookings for this date.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 70,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bookingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F95609',
  },
  bookingDetails: {
    fontSize: 14,
    color: 'black',
  },
  noBookings: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  cancel: {
    borderRadius: 10,
    borderWidth: 0,
    height: 40,
    width: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTime: {
    fontSize: 16,
    marginVertical: 10,
    color: 'blue',
  },
});

export default BookingScreen;
