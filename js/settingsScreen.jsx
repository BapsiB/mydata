import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DataManager from './dataManager.js';


const SettingsScreen = (props) => {

  const navigate = (aDestination) => {
    props.navigation.navigate(aDestination);
  }

  return (
    <View style={{
      flex: 1, justifyContent: 'center',
      alignItems: 'center',
    }}>
      <TouchableOpacity onPress={() => { navigate("Account") }} style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'account-circle'} style={styles.icon} />
        <Text style={styles.text}>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigate("Backup") }} style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'notifications'} style={styles.icon} />
        <Text style={styles.text}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigate("Backup") }} style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'backup'} style={styles.icon} />
        <Text style={styles.text}>Backup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigate("Restore") }} style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'settings-backup-restore'} style={styles.icon} />
        <Text style={styles.text}>Restore</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigate("Debug") }} style={styles.button}>
        <MaterialIcons color={"#555"} size={20} name={'bug-report'} style={styles.icon} />
        <Text style={styles.text}>Debug</Text>
      </TouchableOpacity>

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
    borderColor: '#999',
    borderWidth: 1,
    flexDirection: "row",
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: "#444",
    fontFamily: 'Montserrat-Regular'
  }

});

export default SettingsScreen;