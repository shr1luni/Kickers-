import { View, Text,TouchableOpacity,Image } from 'react-native'
import React from 'react'
import {GestureHandlerRootView, TextInput} from 'react-native-gesture-handler';
export default function InputField(label,icon,inputType,keyboardType,fieldButtonLabel,fieldButtonFunction) {
  return (
    <View>   
  <View
    style={{
      flexDirection: 'row',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      marginBottom: 25,
    }}>
    <Icon
      name="lock"
      size={25}
      style={{marginRight: 5, color: 'black'}}
    />
    <GestureHandlerRootView>
      <TextInput
        placeholder="Password"
        placeholderTextColor={'black'}
        style={{height: 35, top: -5, paddingVertical: 0}}
        secureTextEntry={passwordVisible}
      />
    </GestureHandlerRootView>
    <TouchableOpacity
      onPress={togglePasswordVisibility}
      style={{position: 'absolute', right: 10, alignSelf: 'center'}}>
      <Icon
        name={passwordVisible ? 'eye-slash' : 'eye'}
        size={20}
        color={'black'}
      />
    </TouchableOpacity>
  </View>
  </View>
  )
}
