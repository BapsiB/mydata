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

       this.findAvailableId = function() {
        let lAvailableId = 0;
        while(true) {
            let lFoundId = false;
            var s;
            let array = this.listQuestions;
            for (s of array) {
              if(s.id == lAvailableId.toString()) {
                lFoundId = true;
                break;
              }
            }

            if(!lFoundId) {
                return lAvailableId.toString();
            }
            lAvailableId ++;
        }

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