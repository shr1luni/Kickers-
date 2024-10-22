import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function EditProfileScreen(props) {
  const {navigation,route}=props;
  const {token}=route.params;
  
  
 
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri, name: response.assets[0].fileName, type: response.assets[0].type };
        setProfileImage(source);
      }
    });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
  });
  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    
    if (profileImage) {
      formData.append('image', {
        uri: profileImage.uri,
        name: profileImage.name,
        type: profileImage.type,
      });
    }
  
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('address', values.address || ''); // Include address if you have it in your form
  
    try {
      const response = await fetch('http://192.168.43.19:8001/profile', {
        method: 'PUT', // Change method to PUT
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
      });
  
      if (response.ok) {
        Alert.alert('Profile Updated Successfully');
        
      } else {
        console.warn(response);
        Alert.alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };
  

  return (
    <Formik
      initialValues={{ name: '', email: '', phone: '' }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Edit Profile</Text>
          
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage.uri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="user-circle" size={80} color="#ccc" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formField}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="Enter your name"
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              maxLength={10}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  formField: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
  },
  updateButton: {
    backgroundColor: '#F95609',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
