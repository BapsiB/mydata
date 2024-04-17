import React, {useRef, useEffect, useState} from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import SharedConstants from '../sharedConstants.js';
import axios from 'axios';
import DataManager from '../dataManager.js';
import { jsonToCSV } from 'react-native-csv'
import EventSource from "react-native-sse";

import sharedConstants from "../sharedConstants.js";

const AIAnalyticScreen = () => {

  const [questionAI, setQuestionAI] = React.useState("");
  const [GPTresponse, setGPTResponse] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [areDataSent, setAreDataSent] = React.useState(false);
  const [ws, setWs] = useState(null);

  const listenToAnswerStreaming = (threadId) => {

      const websocket = new WebSocket('ws://10.0.2.2:8080' + '?threadId=' + threadId);
      websocket.onopen = () => {
          console.log('WebSocket Connected');
          websocket.send('Hello Server!');
      };
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.theEnd) {
          console.log("close stream");
          websocket.close();
        }
        else {
          console.log(data.message);
          addMessage(data.message);
      }

      setIsLoading(false);
    };
    
    websocket.onerror = (e) => {
        setIsLoading(false);
          console.log('WebSocket Error ', e.message);
      };
    websocket.onclose = (e) => {
        setIsLoading(false);
          console.log('WebSocket Disconnected', e.code, e.reason);
      };

      setWs(websocket);

      // Cleanup on component unmount
      return () => {
          websocket.close();
      };
  };

  const addMessage = (message) => {
    const parsedText = message.replace(/<br>/g, '\n').split(/<\/?b>/g); // Process bold tags and breaks
    const newParts = parsedText.map((part, index) => ({
        text: part,
        style: index % 2 === 1 ? styles.bold : {}
    }));

    setGPTResponse(currentGPTResponse => [...currentGPTResponse, ...newParts]);
  }

  const initChatGpt = async (forceSendData) => {

    console.log("initChatGpt");
    // if (areDataSent) {
    //   return;
    // }

    try {
      setIsLoading(true); // Start loading
      const obj = DataManager.getQuestionsDataLinear();
      const objStr = JSON.stringify(obj);
      const text = (areDataSent && !forceSendData) ? "" : jsonToCSV(objStr);
      const question = questionAI;

      const response = await axios.post(sharedConstants.apiRoot + '/api', {
        jsonData: text,
        question: question
      });
      console.log("response");
      console.log(response);
      if (response.data == "Nodata") {
        setAreDataSent(false);
        return;
      }

      if (response.data.threadId) {
        listenToAnswerStreaming(response.data.threadId);
      }

      // setGPTResponse(GPTresponse + "\n" + response.data.message);
      setAreDataSent(true);
      setIsLoading(false); // Stop loading after the response is received
      setQuestionAI("");

    } catch (error) {
      Alert.alert("Request Failed", "Check your network.");
      setIsLoading(false); // Stop loading in case of error
      
    }
}
  
const askChatGpt = async () => {
  addMessage("<br><b>user > </b>");
  addMessage(questionAI);
  await initChatGpt()
}

return (
    <View style={styles.mainContainer}>
      <Text style={{ fontFamily: "Montserrat-Regular", marginBottom: 10, color: "#444" }}>
        Ask a question about your data to ChatGPT:
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setQuestionAI}
        value={questionAI}
        multiline={true}
        maxLength={200}
      />
      <TouchableOpacity style={styles.buttonSend} onPress={askChatGpt}>
        <Text style={{ color: "black" }}>Send</Text>
      </TouchableOpacity>
      {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={{flex:9}}>
          <Text>
          {GPTresponse.map((item, index) => (
            <Text key={index} style={item.style}>{item.text}</Text>
          ))}
            </Text>
          </ScrollView>
      )}
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
      height:"10%"
  },
  
  mainContainer: {
    padding: 20,
    fontFamily: "Montserrat-Regular",
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
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
    height:30
  },

  bold: {
    fontWeight: 'bold',
  },
});

export default AIAnalyticScreen;