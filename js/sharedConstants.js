//import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SharedConstants {
    constructor() {

        this.coloursiforgot = {
            colour1:"#ffe2df",
            colour2:"#cccccc",
            colour3:"#afdfe5",
            colour4:"#ffd7a5",
            colour5:"#d1ffcc",
        }
        
        this.coloursAqua = {
            colour1:"#a6f5e2",
            colour2:"#82edd4",
            colour3:"#6de6c2",
            colour4:"#8feadd",
            colour5:"#c8fffd",
        }

        this.coloursCalmPastelAqua = {
            colour1:"#f3e7ea",
            colour2:"#eaf1fa",
            colour3:"#ced6e8",
            colour4:"#fbf1e4",
            colour5:"#f3e2da",
        }

        this.colours = this.coloursiforgot;
 

       this.questionTypes = {
        QUESTION_TYPE_YES_NO: 0,
        QUESTION_TYPE_NUMBER: 1,
        QUESTION_TYPE_INTENSITY: 2,
        QUESTION_TYPE_NOTE: 3,
        QUESTION_TYPE_COLOUR: 4,
        QUESTION_TYPE_COUNT: 5
       };

       this.getDateString = function(date) {
          const dateStr = date.toDateString();
          const today = new Date();
          if(dateStr === today.toDateString()) {
              return dateStr + " (today)";
          }
          return dateStr;
       }

       this.coloursSet = [
        '#89CFF0',
        '#98FF98',
        '#E6E6FA',
        '#FFE5B4',
        '#FADADD',
        '#FFFACD',
        '#C0EAD7',
        '#FF7F50', 
        '#B0E0E6',
           '#F4C2C2'];
        
        this.apiRoot = "http://lebaptiste.com/testApp";
        // this.apiRoot = "http://10.0.2.2:3000";

        this.apiRootWs = "ws://lebaptiste.com:3001";
        // this.apiRootWs = "ws://10.0.2.2:3001";

       this.getIndexOfColour = function(colour) {
        function isColour(c) {
            return (c[3] == colour[3]) &&  (c[5] == colour[5]) && (c[7] == colour[7]);
        }
        const returnValue = this.coloursSet.findIndex(isColour);
        return returnValue;
      }

       this.getAnswerText = function(answerValue, question) {
            switch(+question.type) {
                case this.questionTypes.QUESTION_TYPE_YES_NO:
                    return answerValue == 1 ? "yes" : "no";
                break;
                case this.questionTypes.QUESTION_TYPE_NUMBER:
                    return answerValue;
                break;
                case this.questionTypes.QUESTION_TYPE_INTENSITY:
                    if(answerValue < 15) {
                        if(question.options.min != "") {
                            return question.options.min;
                        }
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
                        if(question.options.max != "") {
                            return question.options.max;
                        }
                        return "very high";
                    }
                break;
                case this.questionTypes.QUESTION_TYPE_NOTE:
                    return "...";
                break;
            }
        }

        this.styles = StyleSheet.create({
           BaseButtons: {
            width: 200,
            borderRadius: 10,
            padding: 10,
            elevation: 0,
            borderColor: '#999',
            borderWidth: 1,
            flexDirection: "row",
            margin: 20,
            justifyContent: 'center',
            alignItems: 'center',
            },

            textButton: {
                color: "#444",
                fontFamily: 'Montserrat-Regular'
            }
       })
  }
}

export default new SharedConstants();