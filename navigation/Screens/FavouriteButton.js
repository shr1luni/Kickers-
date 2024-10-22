import React from 'react';
import {View} from 'react-native';
import {colors, shadow} from '../constants/theme';
import { Icon } from 'react-native-vector-icons/FontAwesome';

const FavouriteButton = ({active, style}) => {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          padding: 4,
          borderRadius: 20,
        },
        shadow.light,
        style,
      ]}>
      <Icon icon={active ? 'FavouriteFilled' : 'Favourite'} size={24} />
    </View>
  );
};

export default FavouriteButton;