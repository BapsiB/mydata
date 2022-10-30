//import React from 'react';
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DataManager {
    constructor() {

       this.listQuestions = [];
       this.daysData = [];
       this.questionCallback = null;

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
      });

        AsyncStorage.getAllKeys().then((stringArray) => {
        let stringDataDayArray = [];

         for (s of stringArray) {
            const key = s;
            if(key.includes("@DataDay:")) {
                stringDataDayArray.push(key);
            }
         }

         AsyncStorage.multiGet(stringDataDayArray, (error, response) => {
            const lArrayObjects = response;
            let pairData;
            for (pairData of lArrayObjects) {
                const key = pairData[0]
                const object = pairData[1] != null ? JSON.parse(pairData[1]) : null;
                const keyDateOnly = key.split("@DataDay:").pop();
                this.daysData[keyDateOnly] = object;
            }
         });
        });

       this.saveListQuestions = function() {
            _storeData("@questions", this.listQuestions);
       }

       function getDateString(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString();
        const day = date.getDate().toString();
        if(month.length < 2) {
            month = "0" + month;
        }

        if(day.length < 2) {
            day = "0" + day;
        }

        return year + month + day;
       }

       /*
        * set the answer of a question for a specified date.
        */
       this.setData = function(questionID, date, value) {

        const lDateStr = getDateString(date);
        const lTagStoring = "@DataDay:" + lDateStr;

        let lDayData = this.daysData[lDateStr];
        if(lDayData === undefined ) {
            lDayData = [];
        }

        lDayData[questionID] = value;
        this.daysData[lDateStr] = lDayData;

        _storeData(lTagStoring, lDayData);
       }

       this.findAvailableId = function() {
       let maxNum = 0;
        let question;
        let array = this.listQuestions;
        for (question of array) {
        const intValue = +question.id;
          if(intValue > maxNum) {
            maxNum = intValue;
          }
        }
        maxNum++;
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

       /*
       * delete the question having the given questionId.
       * return true if the question has been successfully deleted.
       */
       this.deleteQuestion = function(aQuestionId) {
            for( var i = 0; i < this.listQuestions.length; i++){
                const q = this.listQuestions[i];
                if(q.id == aQuestionId) {
                    this.listQuestions.splice(i, 1);
                    this.saveListQuestions();
                    return true;
                }
            }
            return false;
       }

       this.getQuestions = function() {
         return this.listQuestions;
       }

        /*
        * return the answer at the given date, to the question matching the question id.
        */
       this.getAnswerForQuestion = function(aQuestionId, aDate) {
       const lIndex = getDateString(aDate);
        const dateData = this.daysData[lIndex];
        if(dateData !== undefined) {
            return dateData[aQuestionId];
        }
       }

       this.getQuestionWithId = function(aId) {
            let s;
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