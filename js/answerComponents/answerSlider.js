import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
// import Slider from '@react-native-community/slider';
import MySlider from "./mySlider"
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';

/*
* Component showing the slider for both numbered and intensity type of questions.
*/
const AnswerSlider = (props) => {
    const date = props.date;
    const question = props.question;

    let lAnswerForQuestion = DataManager.getAnswerForQuestion(question.id, date);
    if(lAnswerForQuestion === undefined) {
        lAnswerForQuestion = 0;
    }
    const [answer, setAnswer] = React.useState(lAnswerForQuestion);

    let upLabel = question.options.max;
    let downLabel = question.options.min;
    let minValue;
    let maxValue;
    switch(props.question.type) {
        case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
            minValue = question.options.min;
            maxValue = question.options.max;
        break;
        case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
            minValue = 0;
            maxValue = 100;
        break;
    }

    let answerGetData = DataManager.getAnswerForQuestion(question.id, date);

    function onSetValue(aValue) {
        DataManager.setData(question.id, date, aValue);
        props.callback();
    }

    function getStyle(isSelected) {
        return isSelected ? styles.yesNoButtonsSelected : styles.yesNoButtons;
    }

    const heightSlider = 300;

    return (
    <View
        flexDirection='row'
        style={{top:0,
            position:"absolute",
            height:heightSlider,
            justifyContent: 'center',
            marginLeft:"45%"
            }}
    >
        <View style={{width:"30%",}}>
            <Text style={{top:0, position:"absolute", color: 'black', textAlign: 'right', fontSize:20,}}>{upLabel}</Text>
            <Text style={{bottom:0, position:"absolute", color: 'black', textAlign: 'right', fontSize:20}}>{downLabel}</Text>
        </View>
        <View>
           <MySlider
             height={heightSlider}
             style={{width:300}}
             minimumValue={+minValue}
             maximumValue={+maxValue}
             minimumTrackTintColor="#FFFFFF"
             maximumTrackTintColor="#000000"
             vertical={true}
             step={1}
             value={+answer}
             onSlidingComplete={onSetValue}
           />
       </View>
    </View>

    );
}

const styles = StyleSheet.create({

});

export default AnswerSlider;