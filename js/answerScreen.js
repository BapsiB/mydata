import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import AnswerYesNo from './answerComponents/answerYesNo.js';
import AnswerSlider from './answerComponents/answerSlider.js';

const AnswerScreen = (props) => {

  const lCurrentQuestion = DataManager.getQuestionWithId(props.route.params);
  const [currentQuestion, setCurrentQuestion] = React.useState(lCurrentQuestion);

  const date = new Date();
  const [currentDate, setCurrentDate] = React.useState(date);
  const lView = getViewForQuestionId(currentQuestion);

   function getViewForQuestionId(aCurrentQuestion, date) {
        switch(aCurrentQuestion.type) {
            case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
                return <AnswerYesNo date={currentDate} question={aCurrentQuestion} callback={nextQuestion}/>;
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
                return <AnswerSlider date={currentDate} callback={nextQuestion}/>
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
                return <AnswerSlider date={currentDate} question={question} callback={nextQuestion}/>
            break;
        }
   }

   function getDateString() {
       const dateStr = currentDate.toDateString();
       if(dateStr === date.toDateString()) {
           return dateStr + " (today)";
       }
       return dateStr;
   }

   function incrementDate(dateInput,increment) {
       var dateFormatTotime = new Date(dateInput);
       var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
       return increasedDate;
   }

   function nextQuestion() {
        const nextQuestion = DataManager.getNextQuestion(currentQuestion.id);
        setCurrentQuestion(nextQuestion);
   }

  return (
    <View style={{ flex: 1}}>
        <View style={{flex:1, flexDirection: "row", marginVertical:20,}}>
            <View style={{flex:1, marginLeft:20}}>
                <TouchableOpacity onPress={()=>{setCurrentDate(incrementDate(currentDate, -1));;}}>
                  <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowLeft.png")}/>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 12}}>
                <Text style={styles.dateText}>{getDateString()}</Text>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity onPress={()=>{setCurrentDate(incrementDate(currentDate, 1));}}>
                  <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowRight.png")}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, marginRight:10}}>
                <TouchableOpacity style={styles.button_footer} onPress={()=>{setCurrentDate(date);}}>
                  <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowDoubleRight.png")}/>
                </TouchableOpacity>
            </View>
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

        dateText: {
            color: 'black',
            fontSize: 20,
            fontWeight: '500',
            textAlignVertical:'center',
            textAlign:'center',
        },
 });

export default AnswerScreen;