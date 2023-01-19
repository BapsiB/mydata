import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
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
    const valueUnknown = "?";
    //in case answer is undefined we set it to the min value.
    const isNoAnswer = (lAnswer === undefined || lAnswer == null);
    const answerValue =  isNoAnswer ? minValue : lAnswer;
    const answerDisplay = isNoAnswer ? valueUnknown : SharedConstants.getAnswerText(lAnswer, question);
    const [answer, setAnswer] = React.useState(answerValue);
    const [valueDisplay, setValueDisplay] = React.useState(answerDisplay);

    let answerGetData = DataManager.getAnswerForQuestion(question.id, date);

    function onSetValue(aValue) {
        DataManager.setData(question.id, date, aValue);
        props.callback();
    }

    function onValueChanged(aValue) {
        const lValue = SharedConstants.getAnswerText(aValue, question);
        setValueDisplay(lValue);
    }

    function onPressRemoveData() {
        DataManager.removeData(question.id, date);
        setValueDisplay(valueUnknown);
    }

    function getStyle(isSelected) {
        return isSelected ? styles.yesNoButtonsSelected : styles.yesNoButtons;
    }

    const heightSlider = 300;

    return (
    <View
        flexDirection='column'
    >
    <View
        flexDirection='row'
        style={{top:0,
            position:"absolute",
            height:heightSlider,
            justifyContent: 'center',
            marginLeft:"0%"
            }}
    >
        <View style={{width:"40%", alignItems: 'center', justifyContent: 'center'}}>
            <Text   style={{color: 'black', fontSize:50, marginTop:'0%', marginHorizontal:'-20%', textAlign: 'center'}}
                    adjustsFontSizeToFit={true}
                    numberOfLines={2}
                    lineBreakMode='middle'
                    >
                        {valueDisplay}
            </Text>
        </View>
        <View style={{width:"20%", alignItems: 'center'}}>
            <Text style={{top:0, position:"absolute", color: 'black', textAlign: 'right', fontSize:20,}}>{upLabel}</Text>
            <Text style={{bottom:0, position:"absolute", color: 'black', textAlign: 'right', fontSize:20}}>{downLabel}</Text>
        </View>
        <View style={{width:"20%"}}>
           <MySlider
             height={heightSlider}
             style={{width:300}}
             minimumValue={+minValue}
             maximumValue={+maxValue}
             trackColour={SharedConstants.colours.colour3}
             step={maxValue - minValue + 1}
             value={+answer}
             onSlidingComplete={onSetValue}
             onValueChanged={onValueChanged}
           />
       </View>
       <View style={{alignItems: 'center', top:"25%", marginLeft:10 }}>
            <TouchableOpacity style={{justifyContent: 'center', width:"100%", bottom:0, alignItems:'center', height:50 }} onPress={()=>{onPressRemoveData();}}>
                <Image style={{ width:50, height:50,  resizeMode: 'stretch', tintColor: SharedConstants.colours.colour3 }} source={require("../../resources/idontknow.png")}/>
            </TouchableOpacity>
        </View>
    </View>

</View>
    );
}

const styles = StyleSheet.create({

});

export default AnswerSlider;