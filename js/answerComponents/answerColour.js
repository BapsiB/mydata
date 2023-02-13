import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import Slider from '@react-native-community/slider';
import ColorPicker from 'react-native-wheel-color-picker'
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';

/*
* Component showing the slider for both numbered and intensity type of questions.
*/
const AnswerColour = (props) => {
    const date = props.date;
    const question = props.question;
    
    let lAnswer = DataManager.getAnswerForQuestion(question.id, date);
    const isNoAnswer = (lAnswer === undefined || lAnswer == null);
    const answerValue =  isNoAnswer ? "#8d8" : lAnswer;

    const [colour, setColour] = useState(answerValue);
    
    let lAnswerForQuestion = DataManager.getAnswerForQuestion(question.id, date);
    
    function onColorChange(aColour) {

    }

    function onColorChangeComplete(aColour) {
        DataManager.setData(question.id, date, aColour);
        props.callback();
    }

    return (

        <View style={[{margin:30}]}>
            <ColorPicker
                ref={r => { this.picker = r }}
                color={colour}
                swatchesOnly={false}
                onColorChange={onColorChange}
                onColorChangeComplete={onColorChangeComplete}
                thumbSize={40}
                sliderSize={40}
                noSnap={true}
                row={false}
            />
        </View>

    );
}

const styles = StyleSheet.create({

});

export default AnswerColour;