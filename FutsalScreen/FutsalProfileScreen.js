import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {SERVER_URL} from '@env';

export default function FutsalProfileScreen(props) {
  const {navigation, route} = props;
  const {token, futsalId} = route.params;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [amenities, setAmenities] = useState('');
  const [stdPrice, setStdPrice] = useState('');
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState(0);
  const [images, setImages] = useState([]);

  // Time Picker Functions
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] =
    useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState('Start Time');
  const [selectedEndTime, setSelectedEndTime] = useState('End Time');

  const showStartTimePicker = () => {
    setIsStartTimePickerVisible(true);
  };
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
    const formattedTime = formatTime(date);
    setSelectedStartTime(formattedTime);
    setStartTime(date.toISOString());
    hideStartTimePicker();
  };

  const handleConfirmEndTime = date => {
    const formattedTime = formatTime(date);
    setSelectedEndTime(formattedTime);
    setEndTime(date.toISOString());
    hideEndTimePicker();
  };

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Amenities Handling
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

  // Image Picker
  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // 0 to allow multiple images
      },
      response => {
        if (response.assets) {
          setImages([...images, ...response.assets]);
        }
      },
    );
  };

  const removeImage = index => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (
      !name ||
      !phone ||
      !address ||
      // !selectedRadio ||
      !startTime ||
      !endTime ||
      !inputs.length ||
      !stdPrice ||
      !pan
    ) {
      alert('Please fill out all fields.');
      setLoading(false);
      return;
    }

    const url = `http://192.168.43.19:8001/updateFutsalInfo/${futsalId}`;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('address', address);
    // formData.append('type', selectedRadio === 1 ? 'FiveA' : 'SevenA');
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('stdPrice', stdPrice);
    formData.append('pan', pan);

    // Append amenities
    inputs.forEach((input, index) => {
      formData.append(`amenities[${index}]`, input.value);
    });

    // Append images
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || `image_${index}.jpg`,
      });
    });

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      

      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log(result.result.FutsalImage);
        console.log('Futsal information updated successfully:', result);
        // Navigate or give feedback to the user
      } else {
        console.error('Failed to update futsal information:', responseText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear the authentication token or any other stored data
      await AsyncStorage.removeItem('token'); // if you stored the token in AsyncStorage

      // Navigate back to the login screen (assuming you have a Login screen)
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Futsal Profile</Text>
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
          <Text style={styles.formText}>Phone Number</Text>
          <TextInput
            style={styles.formTextInput}
            value={phone}
            maxLength={10}
            keyboardType="phone-pad"
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
          <Text style={styles.formText}>Start Time</Text>
          <TouchableOpacity onPress={showStartTimePicker}>
            <View style={styles.formTextInput}>
              <Text style={styles.formTextInputContent}>
                {selectedStartTime}
              </Text>
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmStartTime}
            onCancel={hideStartTimePicker}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formText}>End Time</Text>
          <TouchableOpacity onPress={showEndTimePicker}>
            <View style={styles.formTextInput}>
              <Text style={styles.formTextInputContent}>{selectedEndTime}</Text>
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmEndTime}
            onCancel={hideEndTimePicker}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formText}>Amenities</Text>
          {inputs.map((input, index) => (
            <View key={index} style={styles.amenityInputContainer}>
              <TextInput
                style={styles.amenityInput}
                value={input.value}
                onChangeText={text => handleInputChange(text, index)}
              />
              <TouchableOpacity onPress={() => removeInput(index)}>
                <Text style={styles.removeAmenityButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addInput}>
            <Text style={styles.addAmenityButton}>Add Amenity</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formText}>Standard Price</Text>
          <TextInput
            style={styles.formTextInput}
            value={stdPrice}
            keyboardType="numeric"
            onChangeText={text => setStdPrice(text)}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formText}>PAN Number</Text>
          <TextInput
            style={styles.formTextInput}
            value={pan}
            keyboardType="numeric"
            maxLength={9}
            onChangeText={text => setPan(text)}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formText}>Upload Images</Text>
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImages}>
            <Text style={styles.buttonText}>Select Images</Text>
          </TouchableOpacity>
          <View style={styles.imagePreviewContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{uri: image.uri}} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}>
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.formBtn}>
          <TouchableOpacity onPress={handleSubmit}>
            <View style={[styles.logoutButton, styles.button]}>
              <Text style={styles.buttonText}>Update</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 70,
  },
  header: {
    color: '#F95609',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  form: {
    backgroundColor: '#FEFEFE',
    borderRadius: 10,
    padding: 20,
  },
  formField: {
    marginBottom: 20,
  },
  formText: {
    color: '#F95609',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formTextInput: {
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  formTextInputContent: {
    fontSize: 16,
    color: '#000',
  },
  imageUploadButton: {
    backgroundColor: '#F95609',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  formBtn: {
    // marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    flexDirection: 'row',
    marginBottom: 20,
    // borderWidth:2
  },
  button: {
    backgroundColor: '#F95609',
  },
  amenityInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#CDCDCD',
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 13,
  },
  amenityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeAmenityButton: {
    color: '#F95609',
    marginLeft: 10,
  },
  addAmenityButton: {
    color: '#F95609',
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 69, 58, 0.8)',
    borderRadius: 15,
    padding: 5,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    // marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
