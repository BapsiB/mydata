import React, { useState } from 'react';
import { Text, View } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import AnswerYesNo from './answerComponents/answerYesNo.js';
import AnswerSlider from './answerComponents/answerSlider.js';

const AnswerScreen = (props) => {

  const [currentQuestionId, setCurrentQuestionId] = React.useState(props.route.params);
  const currentQuestion = DataManager.getQuestionWithId(currentQuestionId);
  const lView = getViewForQuestionId(currentQuestion);

   function getViewForQuestionId(currentQuestion, date) {
        switch(currentQuestion.type) {
            case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
                return <AnswerYesNo date={date} question={currentQuestion}/>;
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
                return <AnswerSlider date={date}/>
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
                return <AnswerSlider date={date} question={question}/>
            break;
        }
   }

  return (
    <View style={{ flex: 1}}>
        {lView}
    </View>
  );
}

export default AnswerScreen;