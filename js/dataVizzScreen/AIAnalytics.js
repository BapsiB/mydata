import React, {useRef, useEffect} from "react";
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

  const listenToAnswerStreaming = () => {
    console.log("go to listenToAnswerStreaming");
    const eventSource = new EventSource(sharedConstants.apiRoot + '/stream');
    
eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  const parsedText = data.message.replace(/<br>/g, '\n').split(/<\/?b>/g); // Process bold tags and breaks
  setGPTResponse(GPTResponsePrev => {
    // This starts with the current state and builds on it, preserving previous messages
    const updatedGPTResponse = [...GPTResponsePrev];
    parsedText.forEach((part, i) => {
      const obj = i % 2 === 1 ? { text: part, style: styles.bold } : { text: part, style: {} };
      updatedGPTResponse.push(obj);
    });
    return updatedGPTResponse;
  });
  setIsLoading(false);
});

    eventSource.addEventListener('error', (error) => {
      console.error('EventSource failed:', error);
      setIsLoading(false);
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  };

  const initChatGpt = async (forceSendData) => {

    console.log("initChatGpt");
    if (areDataSent) {
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const obj = DataManager.getQuestionsDataLinear();
      const objStr = JSON.stringify(obj);
      const text = (areDataSent && !forceSendData) ? "" : jsonToCSV(objStr);

      const response = await axios.post(sharedConstants.apiRoot + '/api', {
        jsonData: text
      });

      console.log("response");
      console.log(response);
      if (response.data == "Nodata") {
        setAreDataSent(false);
        return;
      }

      if (response.data.message == "ok") {
        return;
      }

      // setGPTResponse(GPTresponse + "\n" + response.data.message);
      setAreDataSent(true);
      setIsLoading(false); // Stop loading after the response is received

    } catch (error) {
      Alert.alert("Request Failed", "Check your network.");
      setIsLoading(false); // Stop loading in case of error
      
    }
}
  
  const askChatGpt = async () => {
    await initChatGpt();

    // listenToAnswerStreaming();

  const question = questionAI;
  const response = axios.post(sharedConstants.apiRoot + '/addUserQuestion', {
    question: question,
  });
}

return (
    <View style={styles.mainContainer}>
      <Text style={{ fontFamily: "Montserrat-Regular", marginBottom: 10, color: "#444" }}>
        Ask a question about your data to ChatGPT:
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setQuestionAI}
        multiline={true}
        maxLength={200}
      />
      <TouchableOpacity style={styles.buttonSend} onPress={askChatGpt}>
        <Text style={{ color: "black" }}>Send</Text>
      </TouchableOpacity>
      {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
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

  bold: {
    fontWeight: 'bold',
  },
});

export default AIAnalyticScreen;