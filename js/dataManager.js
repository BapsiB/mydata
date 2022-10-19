//import React from 'react';
import { AsyncStorage } from 'react-native';

export default class DataManager {
    constructor() {

       this.listQuestions = [];
       this.daysData = [];

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
           let lQuestion = {text:aQuestionText, type:aQuestionType, options:aOptions, id:lId};
           this.listQuestions.push(lQuestion);
           this.saveListQuestions();
       }

       this.getQuestions = function() {
        return this.listQuestions;
       }
    }
}