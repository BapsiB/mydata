import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Slider } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';

const AnswerSlider = (props) => {
    const date = props.date;
    const question = props.question;

    let answerGetData = DataManager.getAnswerForQuestion(question.id, date);

    function onPress(isYes) {
        DataManager.setData(question.id, date, isYes ? 1 : 0);
        props.callback();
    }

    function getStyle(isSelected) {
        return isSelected ? styles.yesNoButtonsSelected : styles.yesNoButtons;
    }

    return (

       <Slider orientation="vertical"/>

    );
}

const styles = StyleSheet.create({

 });

export default AnswerSlider;