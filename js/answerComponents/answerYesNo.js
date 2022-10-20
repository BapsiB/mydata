import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import SharedConstants from '../sharedConstants.js';

const AnswerYesNo = (props) => {
    const data = props.date;
    const question = props.question;

    return (
        <View style={{margin: 50, flexDirection: "row", justifyContent: 'center'}}>
        <TouchableOpacity style={[SharedConstants.styles.BaseButtons, styles.yesNoButtons]} onPress={()=>{onPressYes(true);}}>
            <Text style={{color:"black"}}>YES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[SharedConstants.styles.BaseButtons, styles.yesNoButtons]} onPress={()=>{onPress(false);}}>
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
 });

export default AnswerYesNo;