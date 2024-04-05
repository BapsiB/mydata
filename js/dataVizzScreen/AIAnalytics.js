import React, {useRef, useEffect} from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import SharedConstants from '../sharedConstants.js';



const AIAnalyticScreen = () => {

  const [questionAI, setQuestionAI] = React.useState("");

  const askChatGpt = () => {
    const question = questionAI;
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