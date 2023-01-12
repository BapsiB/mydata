import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, View, StyleSheet } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import Utils from '../utils.js'

/*
* Component showing the slider for both numbered and intensity type of questions.
*/
const AnswerNote = (props) => {
    const date = props.date;
    const question = props.question;
    const navigation = props.navigation;
    const maxChar = 1000;
    navigation.addListener('beforeRemove', (e) => {
        onSaveValue();
    });


    let lAnswerForQuestion = DataManager.getAnswerForQuestion(question.id, date);
    if(lAnswerForQuestion === undefined || !lAnswerForQuestion) {
        lAnswerForQuestion = "";
    }

    const [answer, setAnswer] = React.useState(lAnswerForQuestion);

    function onSetValue(aValue) {
        setAnswer(aValue);
    }

    function onSaveValue() {
        DataManager.setData(question.id, date, answer);
        props.callback();
    }

    function getEmptyLines() {
        let string = "";
        for(let j = 0; j < 30; j++) {
          for(let i = 0; i < 128; i++) {
            string += " ";
          }
          string += "\n";
        }
        return string;
      }

    return (
    <SafeAreaView>
        <View style={[styles.inputContainer, {backgroundColor:"#fff"}]}>
        <Text style={[styles.input,  {textDecorationLine: 'underline', color: "#ddd",}]}>{getEmptyLines()}</Text>
        <TextInput
            style={[styles.input, {}]}
            onChangeText={onSetValue}
            onEndEditing={onSaveValue}
            defaultValue={lAnswerForQuestion}
            multiline={true}
            maxLength={maxChar}
        />
        </View>
        <Text style={styles.letterCounter}>{answer.length}/{maxChar}</Text>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
      position:"absolute",
      height: "100%",
      width: "100%",
      borderWidth: 1,
      padding: 10,
      textAlignVertical:'top',
      borderWidth:0,
      fontSize:17,
      color:"#000"
    },

    inputContainer: {
        height: "80%",
        margin: 12,
        borderRadius:20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },

    letterCounter: {
        marginHorizontal: 12,
        textAlign:"right"
      },
  });

export default AnswerNote;