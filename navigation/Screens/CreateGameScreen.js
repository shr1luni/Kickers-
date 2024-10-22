import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  StyleSheet,
  SectionList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import {SERVER_URL} from '@env';

export default function CreateGameScreen({navigation, route}) {
  const {token, match} = route.params;
  const formatTime = time => {
    if (!(time instanceof Date)) {
      console.error('Invalid Date object passed to formatTime:', time);
      return 'Invalid Time';
    }
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const [selectedRadio, setSelectedRadio] = useState(
    match ? (match.futsalType === 'FiveA' ? 1 : 2) : 0,
  );
  const [selectedRadio1, setSelectedRadio1] = useState(
    match ? (match.matchType === 'Friendly' ? 1 : 2) : 0,
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    match ? match.matchDate : 'Select Date',
  );
  const [startTime, setStartTime] = useState(match ? match.startTime : '');
  const [endTime, setEndTime] = useState(match ? match.endTime : '');
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] =
    useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const [searchText, setSearchText] = useState(match ? match.futsalName : '');
  const [futsals, setFutsals] = useState([]);
  const [selectedFutsal, setSelectedFutsal] = useState(
    match ? {name: match.futsalName} : null,
  );

  const [selectedStartTime, setSelectedStartTime] = useState(
    startTime ? formatTime(new Date(startTime)) : 'Start Time',
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    endTime ? formatTime(new Date(endTime)) : 'End Time',
  );

  useEffect(() => {
    if (searchText) {
      fetchFutsals(searchText);
    } else {
      setFutsals([]);
    }
  }, [searchText]);

  const fetchFutsals = async query => {
    try {
      const response = await fetch(
        `http://192.168.43.19:8001/getFutsals?name=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const contentType = response.headers.get('content-type');
      const responseText = await response.text();

      if (contentType && contentType.includes('application/json')) {
        const result = JSON.parse(responseText);
        setFutsals(result.result || []);
      } else {
        console.error('Unexpected response format:', responseText);
        setFutsals([]);
      }
    } catch (error) {
      console.error('Error fetching futsals:', error);
      setFutsals([]);
    }
  };

  const handleFutsalSelect = futsal => {
    setSelectedFutsal(futsal);
    setSearchText(futsal.name);
    setFutsals([]);
    setTimeout(() => {
      setFutsals([]);
    }, 100);
  };

  const handleClearInput = () => setSearchText('');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = date => {
    const formattedDate = format(date, 'yyyy/MM/dd');
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const handleConfirmStartTime = date => {
    if (!(date instanceof Date)) {
      console.error(
        'Invalid Date object passed to handleConfirmStartTime:',
        date,
      );
      return;
    }
    const isoTime = date.toISOString();
    setStartTime(isoTime);
    setSelectedStartTime(formatTime(date));
    setIsStartTimePickerVisible(false);
  };

  const handleConfirmEndTime = date => {
    if (!(date instanceof Date)) {
      console.error(
        'Invalid Date object passed to handleConfirmEndTime:',
        date,
      );
      return;
    }
    const isoTime = date.toISOString();
    setEndTime(isoTime);
    setSelectedEndTime(formatTime(date));
    setIsEndTimePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (
      !searchText ||
      !selectedRadio ||
      !selectedDate ||
      !startTime ||
      !endTime ||
      !selectedRadio1
    ) {
      alert('Please fill out all fields.');
      return;
    }

    const data = {
      futsalName: searchText,
      futsalType: selectedRadio === 1 ? 'FiveA' : 'SevenA',
      matchDate: selectedDate,
      startTime,
      endTime,
      matchType: selectedRadio1 === 1 ? 'Friendly' : "Looser's Pay",
    };

    try {
      const response = await fetch(
        `http://192.168.43.19:8001/match-requests ${match ? `/${match.id}` : ''}`,
        {
          method: match ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      const responseText = await response.text();

      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log('Match request saved successfully:', result);
        Alert.alert(
          'Success',
          `Match ${match ? 'updated' : 'created'} successfully!`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTabs', {token}),
            },
          ],
        );
      } else {
        console.error('Failed to save match request:', responseText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../Screens/images/left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Create A Game</Text>
        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Slot Date</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <View style={styles.datePicker}>
              <Text style={styles.dateText}>{selectedDate}</Text>
              <Icon name="calendar" size={20} style={styles.icon} />
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.timePickerContainer}>
          <Text style={styles.label}>Slot Time</Text>
          <View style={styles.timePickers}>
            <TouchableOpacity onPress={() => setIsStartTimePickerVisible(true)}>
              <View style={styles.timePicker}>
                <Text style={styles.timeText}>
                  {selectedStartTime || 'Select Start Time'}
                </Text>
                <Icon name="clock-o" size={20} style={styles.icon} />
              </View>

              <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmStartTime}
                onCancel={() => setIsStartTimePickerVisible(false)}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEndTimePickerVisible(true)}>
              <View style={styles.timePicker}>
                <Text style={styles.timeText}>
                  {selectedEndTime || 'Select End Time'}
                </Text>
                <Icon name="clock-o" size={20} style={styles.icon} />
              </View>
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmEndTime}
                onCancel={() => setIsEndTimePickerVisible(false)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Futsal Name</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search By Futsal Name"
              placeholderTextColor="#000000"
              style={styles.textInput}
            />
            {searchText ? (
              <TouchableOpacity onPress={handleClearInput}>
                <Icon name="times-circle" size={20} style={styles.clearIcon} />
              </TouchableOpacity>
            ) : (
              <Icon name="search" size={20} style={styles.searchIcon} />
            )}
          </View>
          {futsals.length > 0 && (
            <ScrollView style={styles.futsalList}>
              {futsals.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleFutsalSelect(item)}>
                  <Text style={styles.futsalItem}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.radioContainer}>
          <Text style={styles.label}>Futsal Type</Text>
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>5a Side</Text>
            <TouchableOpacity onPress={() => setSelectedRadio(1)}>
              <View style={styles.radioButton}>
                {selectedRadio === 1 && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>7a Side</Text>
            <TouchableOpacity onPress={() => setSelectedRadio(2)}>
              <View style={styles.radioButton}>
                {selectedRadio === 2 && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.label}>Game Type</Text>
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>Friendly</Text>
            <TouchableOpacity onPress={() => setSelectedRadio1(1)}>
              <View style={styles.radioButton}>
                {selectedRadio1 === 1 && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>Looser's Pay</Text>
            <TouchableOpacity onPress={() => setSelectedRadio1(2)}>
              <View style={styles.radioButton}>
                {selectedRadio1 === 2 && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Create Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  backIcon: {
    height: 30,
    width: 30,
    left: 15,
    top: 20,
    resizeMode: 'cover',
  },
  title: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    left: 25,
    top: 45,
  },
  datePickerContainer: {
    borderBottomWidth: 2,
    borderColor: '#D9D9D9',
    top: 50,
    height: 120,
  },
  label: {
    left: 30,
    top: 20,
    color: '#434343',
  },
  datePicker: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    top: 25,
    height: 50,
    width: 330,
    left: 30,
    flexDirection: 'row',
  },
  dateText: {
    top: 10,
    left: 15,
    color: '#434343',
  },
  icon: {
    right: 10,
    top: 10,
    position: 'absolute',
    color: '#434343',
  },
  timePickerContainer: {
    borderBottomWidth: 2,
    borderColor: '#D9D9D9',
    top: 50,
    height: 120,
  },
  timePickers: {
    borderWidth: 0,
    top: 25,
    height: 70,
    flexDirection: 'row',
    gap: 15,
  },
  timePicker: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    height: 50,
    width: 150,
    left: 30,
    flexDirection: 'row',
  },
  timeText: {
    top: 10,
    left: 15,
    color: '#434343',
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderColor: '#D9D9D9',
    top: 50,
    height: 150,
  },
  textInputContainer: {
    top: 30,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    width: 330,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#F3F3F3',
  },
  textInput: {
    color: 'black',
    width: 290,
    borderColor: 'black',
    borderWidth: 0,
    paddingLeft: 15,
    fontSize: 12,
  },
  clearIcon: {
    color: '#8D8A8A',
    left: 10,
    top: 15,
  },
  searchIcon: {
    color: '#8D8A8A',
    left: 10,
    top: 15,
  },
  radioContainer: {
    borderBottomWidth: 2,
    borderColor: '#D9D9D9',
    top: 50,
    height: 150,
  },
  radioGroup: {
    flexDirection: 'row',
    top: 30,
    borderWidth: 0,
    borderColor: 'red',
    height: 40,
    alignItems: 'center',
    left: 35,
  },
  radioLabel: {
    color: '#434343',
    fontSize: 18,
  },
  radioButton: {
    height: 25,
    borderWidth: 2,
    borderColor: 'black',
    width: 25,
    left: 20,
    borderRadius: 25,
  },
  radioButtonSelected: {
    height: 18,
    borderWidth: 0,
    borderColor: 'black',
    width: 18,
    backgroundColor: '#F95609',
    borderRadius: 18,
    top: 1.5,
    alignSelf: 'center',
  },
  submitContainer: {
    borderBottomWidth: 0,
    top: 65,
    height: 80,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 70,
  },
  submitButton: {
    height: 60,
    width: 160,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#F95609',
    borderRadius: 15,
  },
  submitButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  futsalList: {
    marginTop: -30,
    height: 250, // Adjust this value to your desired height
    width: 330, // Adjust this value to match your layout
    backgroundColor: 'white',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 1000,
    alignSelf: 'center',
  },
  futsalItem: {
    padding: 10,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    color: 'black',
  },
});
