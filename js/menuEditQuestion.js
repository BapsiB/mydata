import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';


const MenuEditQuestion = (props) => {
  return (
    <Provider>
      <View
        style={{
          paddingTop: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          zIndex: 10,
          elevation: 10,
        }}>
        <Menu.Item leadingIcon="square-edit-outline" onPress={() => {}} title="Edit" />
        <Menu.Item leadingIcon="delete" onPress={() => {}} title="Delete" />
      </View>
    </Provider>
  );
};


export default MenuEditQuestion;