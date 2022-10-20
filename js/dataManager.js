//import React from 'react';
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DataManager {
    constructor() {

       this.listQuestions = [];
       this.daysData = [];
       this.questionCallback = null;

       this.saveListQuestions = function() {
            _storeData("@questions", this.listQuestions);
       }

       const _storeData = async (key, data) => {
        try {
            const jsonValue = JSON.stringify(data)
            await AsyncStorage.setItem(key, jsonValue)
          } catch (e) {
            // saving error
          }
       };

       const getData = async (key) => {
         try {
           const jsonValue = await AsyncStorage.getItem(key)
           return jsonValue != null ? JSON.parse(jsonValue) : null;
         } catch(e) {
           // error reading value
         }
       }

       const that = this;
       getData("@questions").then((data) => {
        that.listQuestions = data;
        if(that.questionCallback) {
            that.questionCallback();
        }
       })

       /*
        * set the answer of a question for a specified date.
        */
       this.setData = function(questionID, date, value) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString();
        const day = date.getDate().toString();
        if(month.length < 2) {
            month = "0" + month;
        }

        if(day.length < 2) {
            day = "0" + day;
        }
        const lTag = "@DataDay:" + year + month + day;

        let lTagData = this.daysData[lTag];
        if(lTagData === undefined ) {
            lTagData = [];
        }

        lTagData[questionID] = value;

        _storeData(lTag, lTagData);
       }

       this.findAvailableId = function() {
       let maxNum = 0;
        while(true) {
            var s;
            let array = this.listQuestions;
            for (s of array) {
            const intValue = s.id.parseInt();
              if(intValue > maxNum) {
                maxNum = intValue;
              }
            }
        }
        return maxNum.toString();
       }

       this.addQuestion = function(aQuestionText, aQuestionType, aOptions) {
           const lId = this.findAvailableId();
           let lQuestion = new Question({text:aQuestionText, type:aQuestionType, options:aOptions, id:lId});
           this.listQuestions.push(lQuestion);
           this.saveListQuestions();

           if(this.questionCallback)
            this.questionCallback();
       }

       this.getQuestions = function() {
         return this.listQuestions;
       }

       this.getQuestionWithId = function(aId) {
            for (s of this.listQuestions) {
                if(s.id == aId) {
                    return s;
                }
            }
            return null;
       }

       /*
       * return the next question in the list.
       */
       this.getNextQuestion = function(questionId) {
           const len = this.listQuestions.length;
           let indexReturn = 0;
           let i;
           for (i=0; i<len; ++i) {
               const s = this.listQuestions[i];

               if(s.id == questionId) {
                   if(i == (this.listQuestions.length - 1)) {
                       indexReturn = 0;
                   }
                   else {
                    indexReturn = i + 1;
                   }
                   break;
               }
           }

           return this.listQuestions[indexReturn];
       }

        this.setQuestionsListener = function(callback){
            this.questionCallback = callback;
        }

    }
}

class Question {
    constructor(data) {
        this.text = data.text;
        this.type = data.type;
        this.options = data.options;
        this.id = data.id;

        this.getText = function() {
            return this.text;
        }
    }
}

export default new DataManager();