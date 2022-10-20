import React, { useState } from 'react';
import { Text, View } from 'react-native';

const AnswerYesNo = (props) => {
    const data = props.date;
    const question = props.question;

  return (
    <View style={{ flex: 1}}>
        <Text style={{color:"black"}}>{question.text}</Text>
    </View>
  );
}

export default AnswerYesNo;