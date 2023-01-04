import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, StyleSheet } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';

/*
* Component showing the slider for both numbered and intensity type of questions.
*/
const AnswerNote = (props) => {
    const date = props.date;
    const question = props.question;
    const navigation = props.navigation;
    navigation.addListener('beforeRemove', (e) => {
        onSaveValue();
    });
      

    let lAnswerForQuestion = DataManager.getAnswerForQuestion(question.id, date);
    if(lAnswerForQuestion === undefined) {
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

    return (
    <SafeAreaView>
        <TextInput
            style={styles.input}
            onChangeText={onSetValue}
            onEndEditing={onSaveValue}
            defaultValue={lAnswerForQuestion}
            multiline={true}
            maxLength={1000}
        />
        <Text style={styles.letterCounter}>{answer.length}/500</Text>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
      height: "80%",
      margin: 12,
      borderWidth: 1,
      padding: 10,
      textAlignVertical:'top'
    },
    letterCounter: {
        marginHorizontal: 12,
        textAlign:"right"
      },
  });

export default AnswerNote;