import React, {useRef, useEffect} from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import SharedConstants from '../sharedConstants.js';
import axios from 'axios';
import DataManager from '../dataManager.js';
import { jsonToCSV } from 'react-native-csv'
import { color } from "react-native-reanimated";
import sharedConstants from "../sharedConstants.js";

const AIAnalyticScreen = () => {

  const [questionAI, setQuestionAI] = React.useState("");
  const [GPTresponse, setGPTResponse] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [areDataSent, setAreDataSent] = React.useState(false);


  const askChatGpt = async (forceSendData) => {
    const question = questionAI;

    try {
      setIsLoading(true); // Start loading
      const obj = DataManager.getQuestionsDataLinear();
      const objStr = JSON.stringify(obj);
      const text = (areDataSent && !forceSendData) ? "" : jsonToCSV(objStr);

      const response = await axios.post(sharedConstants.apiRoot + '/api', {
        question: question,
        jsonData: text
      });

      if (response.data == "Nodata") {
        setAreDataSent(false);
        askChatGpt(true);
        return;
      }
      setGPTResponse(GPTresponse + "\n" + response.data.message);
      setAreDataSent(true);
      setIsLoading(false); // Stop loading after the response is received

    } catch (error) {
      Alert.alert("Request Failed", "Check your network.");
      setIsLoading(false); // Stop loading in case of error
      
    }
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
            <Text style={{ fontFamily: "Montserrat-Regular", marginBottom: 10, color: "#444" }}>
              {GPTresponse}
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
});

export default AIAnalyticScreen;