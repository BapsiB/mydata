import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import AnswerYesNo from './answerComponents/answerYesNo.js';
import AnswerSlider from './answerComponents/answerSlider.js';

const AnswerScreen = (props) => {

  const [currentQuestionId, setCurrentQuestionId] = React.useState(props.route.params);
  const currentQuestion = DataManager.getQuestionWithId(currentQuestionId);
  const date = Date.now();
  const [currentDate, setCurrentDate] = React.useState(date);
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

   function getDateString() {
        return date.toDateString()
   }

  return (
    <View style={{ flex: 1}}>
        <View style={{ flex: 1}}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>
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