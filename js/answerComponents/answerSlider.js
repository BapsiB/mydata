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
            minValue = "0";
            maxValue = "100";
        break;
    }

    let lAnswer = DataManager.getAnswerForQuestion(question.id, date);
    //in case answer is undefined we set it to the min value.
    lAnswer = (lAnswer === undefined) ? +minValue : lAnswer;
    const [answer, setAnswer] = React.useState(lAnswer);
    const [valueDisplay, setValueDisplay] = React.useState(answer);

    let answerGetData = DataManager.getAnswerForQuestion(question.id, date);

    function onSetValue(aValue) {
        DataManager.setData(question.id, date, aValue);
        props.callback();
    }

    function onValueChanged(aValue) {
        setValueDisplay(aValue);
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
            marginLeft:"5%"
            }}
    >
        <View style={{width:"40%", alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'black', fontSize:50, marginTop:'0%'}}>{valueDisplay}</Text>
        </View>
        <View style={{width:"30%", alignItems: 'center'}}>
            <Text style={{top:0, position:"absolute", color: 'black', textAlign: 'right', fontSize:20,}}>{upLabel}</Text>
            <Text style={{bottom:0, position:"absolute", color: 'black', textAlign: 'right', fontSize:20}}>{downLabel}</Text>
        </View>
        <View>
           <MySlider
             height={heightSlider}
             style={{width:200 + Math.random() * 100}}
             minimumValue={+minValue}
             maximumValue={+maxValue}
             trackColour={question.colour}
             step={maxValue - minValue + 1}
             value={+answer}
             onSlidingComplete={onSetValue}
             onValueChanged={onValueChanged}
           />
       </View>
    </View>

    );
}

const styles = StyleSheet.create({

});

export default AnswerSlider;