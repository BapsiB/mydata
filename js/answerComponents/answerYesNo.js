import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';

const AnswerYesNo = (props) => {
    const date = props.date;
    const question = props.question;
    const [answer, setAnswer] = React.useState(DataManager.getAnswerForQuestion(question.id, date));

    function onPress(isYes) {
        const lAnswer = isYes ? 1 : 0;
        DataManager.setData(question.id, date, lAnswer);
        setAnswer(lAnswer);
        props.callback();
    }

    function getStyle(isSelected) {
        return isSelected ? styles.yesNoButtonsSelected : styles.yesNoButtons;
    }

    return (
        <View style={{margin: 50, flexDirection: "row", justifyContent: 'center'}}>
        <TouchableOpacity style={[SharedConstants.styles.BaseButtons, getStyle(answer == 1)]} onPress={()=>{onPress(true);}}>
            <Text style={{color:"black"}}>YES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[SharedConstants.styles.BaseButtons, getStyle(answer == 0)]} onPress={()=>{onPress(false);}}>
            <Text style={{color:"black"}}>NO</Text>
        </TouchableOpacity>
       </View>
    );
}

const styles = StyleSheet.create({
    yesNoButtons: {
        margin:20,
        height:70
    },

    yesNoButtonsSelected: {
        margin:20,
        height:70,
        backgroundColor:"#eef",
    },
 });

export default AnswerYesNo;