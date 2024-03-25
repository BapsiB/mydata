import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DataManager from './dataManager.js';


const SettingsScreen = (props) => {

  return (
    <View style={{
      flex: 1, justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'backup'} style={styles.icon} />
        <Text>Backup</Text>
      </View>
      <View style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'settings-backup-restore'} style={styles.icon} />
        <Text>Restore</Text>
      </View>
      <View style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'bug-report'} style={styles.icon} />
        <Text>Debug</Text>
      </View>

    </View >
  )
}


const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  icon: {
    marginHorizontal: 10
  },

  button: {
    width: 200,
    borderRadius: 10,
    padding: 10,
    elevation: 0,
    marginHorizontal: 35,
    borderColor: '#888',
    borderWidth: 1,
    flexDirection: "row",
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default SettingsScreen;