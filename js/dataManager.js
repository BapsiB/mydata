//import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedConstants from './sharedConstants.js';
import Question from './question.js';
import Datas from './datas'

class DataManager {
    constructor() {

       this.listQuestions = [];
       this.questionsSettings = [];
       this.daysData = Datas;
       this.questionCallback = null;
       // callback to be called when the answers data are loaded.
       this.answersUpdateCallback = null;

       this.clearAll = async () => {
            try {
            await AsyncStorage.clear()
            } catch(e) {
            // clear error
            }
        
            console.log('Done.')
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
      if(data) {
        that.listQuestions = [];
        for (question of data) {
            const questionCast = new Question(question, that);
            that.listQuestions.push(questionCast);
        }
      }

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
            let needsNewSave = false;
            for (pairData of lArrayObjects) {
                const key = pairData[0]
                const object = pairData[1] != null ? JSON.parse(pairData[1]) : null;
                const keyDateOnly = key.split("@DataDay:").pop();

                const newObj = [];

                this.daysData.set(keyDateOnly, object);
            }

            if(this.answersUpdateCallback) {
                this.answersUpdateCallback();
            }
         });
        });

        this.getAllDataStrorageAsString = function() {
            var promise = new Promise( (resolve, reject) => {
                AsyncStorage.getAllKeys().then((stringArray) => {
        
                    AsyncStorage.multiGet(stringArray, (error, response) => {
                        resolve(JSON.stringify(response));
                    });
               
               })
             });
       
            return promise;

        };

       this.saveListQuestions = function() {
            const lListSavable = [];
            for(question of this.listQuestions) {
                lListSavable.push(question.getStringifyiableObject());
            }
            _storeData("@questions", lListSavable);
       }

       this.setQuestionVisibility = function(questionId, visibility) {
        this.questionsSettings[questionId] = {visibility:visibility};
        _storeData("@questionsSettings", this.questionsSettings);
       }

       this.getQuestionVisibility = function(questionId) {
        const lObj = this.questionsSettings[questionId];
        if(lObj) {
            const answer = lObj.visibility;
            if(answer !== undefined) {
                return answer;
            }
        }
        return true;
       }

       this.getDateString = function(date) {
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        if(month.length < 2) {
            month = "0" + month;
        }

        if(day.length < 2) {
            day = "0" + day;
        }

        return year + month + day;
       }

       this.getDateFromString = function(dateString) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return new Date(year, month - 1, day);
       }

       /*
        * set the answer of a question for a specified date.
        */
       this.setData = function(questionID, date, value) {
            const lDateStr = this.getDateString(date);
            const lTagStoring = "@DataDay:" + lDateStr;

            let lDayData = this.daysData.getValuesForDate(lDateStr);
            if(lDayData === null ) {
                lDayData = [];
            }

            let fountIt = false;
            for(let i in lDayData) {
                if(lDayData[i].id == questionID) {
                    lDayData[i].v = value;
                    fountIt = true;
                    break;
                }
            }

            if(!fountIt) {
                lDayData.push({id:questionID, v:value});
            }

            _storeData(lTagStoring, lDayData);
            
            this.answersUpdateCallback();
       }

        /*
        * remove the data matching the question id at the given date..
        */
       this.removeData = function(questionID, date) {
            const lDateStr = this.getDateString(date);
            const lTagStoring = "@DataDay:" + lDateStr;

            let lDayData = this.daysData.getValuesForDate(lDateStr);
            if(lDayData === null ) {
                return
            }

            for(let i = 0; i < lDayData.length; i++) {
                if(lDayData[i].id == questionID) {
                    lDayData.splice(i, 1);
                    break;
                }
            }

            _storeData(lTagStoring, lDayData);

            this.answersUpdateCallback();
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

       this.addQuestion = function(aQuestionText, aQuestionType, aOptions, colour) {
           const lId = this.findAvailableId();
           let lQuestion = new Question({text:aQuestionText, type:aQuestionType, options:aOptions, colour, id:lId}, this);
           this.listQuestions.push(lQuestion);
           this.saveListQuestions();

           if(this.questionCallback)
            this.questionCallback();
       }

       this.updateQuestion = function(aQuestionId, aQuestionText, questionType, options, colour) {
        let s;
        for (s of this.listQuestions) {
            if(s.id == aQuestionId) {
                s.text = aQuestionText;
                s.type = questionType;
                s.setOptions(options);
                s.colour = colour;
            }
        }

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
        const filtered = this.listQuestions.filter((question) => {return question.type != SharedConstants.questionTypes.QUESTION_TYPE_NOTE});
        return filtered;
       }

       this.getNotes = function() {
        const filtered = this.listQuestions.filter((question) => {return question.type == SharedConstants.questionTypes.QUESTION_TYPE_NOTE});
        return filtered;
      }

        /*
        * return the answer at the given date, to the question matching the question id.
        */
       this.getAnswerForQuestion = function(aQuestionId, aDate) {
        const lDate = this.getDateString(aDate);
        const dateData = this.daysData.getValue(lDate, aQuestionId);
        return dateData;
       }

       this.getAllData = function() {
        return this.daysData.getAllData();
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
       * @questionId, id of the queston
       * @goForward, wether we want to go forward (true) or backward (false)
       */
       this.getNextQuestion = function(questionId, goForward, onlyTakeUnreplied, discardNotes, date) {
           const len = this.listQuestions.length;
           let returnQuestion = null;
           let indexReturn = 0;
           let i;
           for (i=0; i<len; ++i) {
               const s = this.listQuestions[i];

               if(s.id == questionId) {
                   if(i == (this.listQuestions.length - 1) && goForward) {
                       indexReturn = 0;
                   }
                   else if(i == 0 && !goForward) {
                        indexReturn = this.listQuestions.length - 1;
                   }
                   else {
                    const toAdd =  goForward ? 1 : -1;
                    indexReturn = i + toAdd;
                   }
                   const lQuestion = this.listQuestions[indexReturn];
                   // discard the notes cards if that's what we want.
                   if(discardNotes && lQuestion.isNote()) {
                     return this.getNextQuestion(indexReturn, goForward, onlyTakeUnreplied, discardNotes, date);
                   }

                   if(onlyTakeUnreplied) {
                    const answer = this.getAnswerForQuestion(lQuestion.id, date);
                    if(answer == null) {
                        return lQuestion;
                    }
                    else {
                        return this.getNextQuestionUnrespoindedInArray(i, date);
                    }
                   }
                   else {
                    return lQuestion;
                   }
                   
               }
           }

           return 
       }

       this.getNextQuestionUnrespoindedInArray = function(aIndexInArray, date) {
        let index;
        for(let indexAdd = 0; indexAdd < this.listQuestions.length; indexAdd++) {
            index = (aIndexInArray + indexAdd) % this.listQuestions.length;
            const answer = this.getAnswerForQuestion(this.listQuestions[index].id, date);

            if((answer == null) && !this.listQuestions[index].isNote()) {
                return this.listQuestions[index];
            }
        }
        return null;
       }

        this.setQuestionsListener = function(callback){
            this.questionCallback = callback;
        }

        this.setAnswersUpdateListener = function(callback){
            this.answersUpdateCallback = callback;
        }
    }
}

export default new DataManager();