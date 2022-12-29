//import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SharedConstants {
    constructor() {

       this.questionTypes = {
        QUESTION_TYPE_YES_NO: 0,
        QUESTION_TYPE_NUMBER: 1,
        QUESTION_TYPE_INTENSITY: 2,
        QUESTION_TYPE_COUNT: 3
       };

       this.getDateString = function(date) {
          const dateStr = date.toDateString();
          const today = new Date();
          if(dateStr === today.toDateString()) {
              return dateStr + " (today)";
          }
          return dateStr;
       }

       this.getAnswerText = function(answerValue, questionType) {
            switch(+questionType) {
                case this.questionTypes.QUESTION_TYPE_YES_NO:
                    return answerValue == 1 ? "yes" : "no";
                break;
                case this.questionTypes.QUESTION_TYPE_NUMBER:
                    return answerValue;
                break;
                case this.questionTypes.QUESTION_TYPE_INTENSITY:
                    if(answerValue < 15) {
                        return "very low";
                    }
                    else if(answerValue < 30) {
                        return "low";
                    }
                    else if(answerValue < 70) {
                        return "mild";
                    }
                    else if(answerValue < 85) {
                        return "high";
                    }
                    else {
                        return "very high";
                    }
                break;
            }
        }

        this.styles = StyleSheet.create({
           BaseButtons: {
               height:50,
               width:130,
               marginHorizontal:5,
               backgroundColor: 'black',
               color:"black",
               alignItems: 'center',
               backgroundColor:"white",
               borderWidth:1,
               borderRadius:10,
               textAlignVertical:'center',
               textAlign:'center',
               justifyContent: 'center',
               alignItems: 'center',
           },

       })
  }
}

export default new SharedConstants();