import React, { useState } from 'react';
import { Text, View } from 'react-native';

const AnswerScreen = (props) => {

  const [currentQuestionId, setCurrentQuestionId] = React.useState(props.route.params);

  const View = getViewForQuestionId(currentQuestionId);

   function getViewForQuestionId(questionId, date) {
//        switch(questionId) {
//            case
//        }
   }

  return (
    <View style={{ flex: 1}}>

    </View>
  );
}

export default AnswerScreen;