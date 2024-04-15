
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import sharedConstants from './sharedConstants';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(sharedConstants.apiRoot + '/login', {
        username,
        password,
      });
      // Handle success by navigating or saving the token
      // Example: navigation.navigate('Home');
      Alert.alert(response.data, "You are now logged in.");
    } catch (error) {
      Alert.alert("Login Failed", "Check your credentials.");
    }
  };

  const testLogin = async () => {
    try {
      const response = await axios.get(sharedConstants.apiRoot + '/test');
      // Handle success by navigating or saving the token
      // Example: navigation.navigate('Home');
      Alert.alert(response.data, "You are now logged in.");
    } catch (error) {
      Alert.alert("Login Failed", "Check your credentials.");
    }
  }

  return (
    <View>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={{color:"#444"}} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={{color:"#444"}} />
      <Button title="Log In" onPress={handleLogin} />
      <Button title="Test" onPress={testLogin} />
    </View>
  );
};

const Account = (props) => {

  return (
    <View style={{flex:1}}>
      <LoginScreen></LoginScreen>

    </View >
  )
}


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
});

export default Account;