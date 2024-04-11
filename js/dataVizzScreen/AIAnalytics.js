import React, {useRef, useEffect} from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import SharedConstants from '../sharedConstants.js';
import axios from 'axios';
import DataManager from '../dataManager.js';
import { jsonToCSV } from 'react-native-csv'

const AIAnalyticScreen = () => {

  const [questionAI, setQuestionAI] = React.useState("");
  const [GPTresponse, setGPTResponse] = React.useState("");

  const askChatGpt = async () => {
    const question = questionAI;

    try {
      const obj = DataManager.getQuestionsDataLinear();
      const objStr = JSON.stringify(obj);
      const text = jsonToCSV(objStr);
      
      const response = await axios.post('http://lebaptiste.com/testApp/api', {
        question: question,
        jsonData: text
      });
      // Handle success by navigating or saving the token
      // Example: navigation.navigate('Home');
      setGPTResponse(response.data.message);
      
    } catch (error) {
      Alert.alert("Login Failed", "Check your credentials.");
    }

  }

  return (
    <View style={styles.mainContainer}>
      <Text style={{fontFamily:"Montserrat-Regular", marginBottom:10}}>ask a question about your data to ChatGPT:</Text>
      <TextInput
          style={[styles.input, {}]}
          onChangeText={setQuestionAI}
          multiline={true}
          maxLength={100}
        />
      <TouchableOpacity style={[styles.buttonSend, {}]} onPress={askChatGpt}>
        <Text style={{color:"black"}}>send</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text style={{ fontFamily: "Montserrat-Regular", marginBottom: 10 }}>{GPTresponse}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    input: {
      height: 100,
      width: "100%",
      borderWidth: 1,
      borderColor:"#888",
      padding: 10,
      textAlignVertical:'top',
      borderWidth:0,
      fontSize:17,
      color: "#333",
      backgroundColor: "white",
    fontFamily: "Montserrat-Regular",

  },
  
  mainContainer: {
    padding: 20,
    fontFamily: "Montserrat-Regular",
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonSend: {
    width: 100,
    borderRadius: 10,
    padding: 10,
    elevation: 0,
    borderColor: '#999',
    borderWidth: 1,
    // flexDirection: "row",
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIAnalyticScreen;