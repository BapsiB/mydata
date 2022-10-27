import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import AnswerYesNo from './answerComponents/answerYesNo.js';
import AnswerSlider from './answerComponents/answerSlider.js';
import HeaderDate from './headerDate.js';

const AnswerScreen = (props) => {

  const lCurrentQuestion = DataManager.getQuestionWithId(props.route.params);
  const [currentQuestion, setCurrentQuestion] = React.useState(lCurrentQuestion);


//  const [currentDate, setCurrentDate] = React.useState(date);
  const lView = getViewForQuestionId(currentQuestion);

   function getViewForQuestionId(aCurrentQuestion, date) {
        switch(aCurrentQuestion.type) {
            case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
                return <AnswerYesNo date={HeaderDate.getDate()} question={aCurrentQuestion} callback={nextQuestion}/>;
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
                return <AnswerSlider date={HeaderDate.getDate()} callback={nextQuestion}/>
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
                return <AnswerSlider date={HeaderDate.getDate()} question={question} callback={nextQuestion}/>
            break;
        }
   }

   function nextQuestion() {
        const nextQuestion = DataManager.getNextQuestion(currentQuestion.id);
        setCurrentQuestion(nextQuestion);
   }
  return (
    <View style={{ flex: 1}}>
        {HeaderDate.getHeader()}
        <View style={{ flex: 1}}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>
        <View style={{ flex: 1}}>
            {lView}
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <TouchableOpacity style={[SharedConstants.styles.BaseButtons]} onPress={()=>{onPress(false);}}>
            <Text style={{color:"black"}}>CANCEL</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    questionText: {
        marginVertical:50,
        marginHorizontal:20,
        color: 'black',
        fontSize: 35,
        fontWeight: '500',
        textAlignVertical:'center',
        textAlign:'center',
    },

 });

export default AnswerScreen;