import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {SERVER_URL} from '@env';

export default function FutsalRegistrationScreen(props) {
  const {navigation, route} = props;
  const {token} = route.params;

  const [selectedRadio, setSelectedRadio] = useState(0);

  const [loading, setLoading] = useState(false);

  //data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [amenities, setAmenities] = useState('');
  const [stdPrice, setStdPrice] = useState('');
  const [pan, setPan] = useState('');

  //timee
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] =
    useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const showStartTimePicker = () => {
    setIsStartTimePickerVisible(true);
  };
  const [selectedStartTime, setSelectedStartTime] = useState('Start Time');
  const [selectedEndTime, setSelectedEndTime] = useState('End Time');
  const hideStartTimePicker = () => {
    setIsStartTimePickerVisible(false);
  };

  const showEndTimePicker = () => {
    setIsEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setIsEndTimePickerVisible(false);
  };
  const handleConfirmStartTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    setSelectedStartTime(formattedTime);
    setStartTime(date.toISOString()); // Save full ISO string for Prisma
    hideStartTimePicker();
  };

  const handleConfirmEndTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    setSelectedEndTime(formattedTime);
    setEndTime(date.toISOString()); // Save full ISO string for Prisma
    hideEndTimePicker();
  };

  //ameneties
  const [inputs, setInputs] = useState([{key: '', value: ''}]);
  const addInput = () => {
    setInputs([...inputs, {key: '', value: ''}]);
  };

  const handleInputChange = (text, index) => {
    const newInputs = [...inputs];
    newInputs[index].value = text;
    setInputs(newInputs);
  };

  const removeInput = index => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Check if any required field is empty
    if (
      !name ||
      !phone ||
      !address ||
      !selectedRadio ||
      !startTime ||
      !endTime ||
      !inputs.length ||
      !stdPrice ||
      !pan
    ) {
      alert('Please fill out all fields.');
      return;
    }

    const url ='http://192.168.43.19:8001/addFutsalInfo';

    const data = {
      name,
      phone,
      address,
      type: selectedRadio === 1 ? 'FiveA' : 'SevenA',
      startTime,
      endTime,
      amenities: inputs.map(input => input.value),
      stdPrice,
      pan,
    };

    try {
      const response = await fetch(url, {
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

        console.log('Futsal information added successfully:', result);
        const futsalId = result.result.id;
        console.log(futsalId);

        navigation.navigate('FutsalScreens', {token, futsalId});
      } else {
        console.error('Failed to add futsal information:', responseText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text
        style={{
          color: '#F95609',
          alignSelf: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 50,
        }}>
        Registration Screen
      </Text>
      <View style={styles.subContainer}>
        <Text style={{color: 'black', padding: 15}}>
          *Please Fill The Form Before Proceeding
        </Text>
        <View style={styles.form}>
          <View style={styles.formField}>
            <Text style={styles.formText}>Futsal Name</Text>
            <TextInput
              style={styles.formTextInput}
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formText}>Pan Number</Text>
            <TextInput
              style={styles.formTextInput}
              keyboardType="numeric"
              maxLength={9}
              value={pan}
              onChangeText={text => setPan(text)}
            />
          </View>
          {loading && <ActivityIndicator size="large" color="green" />}
          <View style={styles.formField}>
            <Text style={styles.formText}>Phone Number</Text>
            <TextInput
              style={styles.formTextInput}
              keyboardType="numeric"
              maxLength={10}
              value={phone}
              onChangeText={text => setPhone(text)}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formText}>Address</Text>
            <TextInput
              style={styles.formTextInput}
              value={address}
              onChangeText={text => setAddress(text)}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formText}>Futsal Type</Text>
            <View
              style={{
                flexDirection: 'row',
                top: 10,
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
                top: 10,
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
          <View style={styles.formField}>
            <Text style={styles.formText}>Time</Text>
            <View
              style={{
                borderWidth: 0,
                width: 320,
                gap: 12,
                left: -8,
                top: 10,
                height: 60,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={showStartTimePicker}>
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#D9D9D9',
                    top: 0,
                    height: 50,
                    width: 150,

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
                  isVisible={isStartTimePickerVisible}
                  mode="time"
                  onConfirm={handleConfirmStartTime}
                  onCancel={hideStartTimePicker}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={showEndTimePicker}>
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#D9D9D9',
                    top: 0,
                    height: 50,
                    width: 150,
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
                  isVisible={isEndTimePickerVisible}
                  mode="time"
                  onConfirm={handleConfirmEndTime}
                  onCancel={hideEndTimePicker}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formText}>Amenities</Text>
            {inputs.map((input, index) => (
              <View key={index} style={styles.inputContainer}>
                <TextInput
                  placeholder={`Input ${index + 1}`}
                  value={input.value}
                  onChangeText={text => handleInputChange(text, index)}
                  style={styles.formTextInput}
                />
                <TouchableOpacity onPress={() => removeInput(index)}>
                  <Icon
                    name="trash"
                    size={20}
                    color="red"
                    style={{marginLeft: 10, marginTop: 15}}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={[styles.addBtn]}>
            <TouchableOpacity onPress={addInput}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formText}>Standard Price</Text>
            <TextInput
              style={styles.formTextInput}
              keyboardType="numeric"
              value={stdPrice}
              onChangeText={text => setStdPrice(text)}
            />
          </View>
          <View style={styles.formBtn}>
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    marginTop: 30,
    borderTopWidth: 2,
    borderColor: '#F95609',
    backgroundColor: '#E5E5E5',
  },
  form: {
    flex: 1,
    width: 340,
    borderWidth: 0,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#FEFEFE',
  },
  formField: {
    flex: 0,
    rowGap: 8,
    left: 20,
    marginTop: 20,
  },
  formText: {
    color: '#F95609',
    left: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  formTextInput: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#CDCDCD',
    width: 300,
    color: 'black',
    fontSize: 14,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#F95609',
    borderRadius: 10,

    height: 50,
    width: 120,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formBtn: {
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addBtn: {
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
