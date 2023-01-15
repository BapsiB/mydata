//import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedConstants from './sharedConstants.js';

class DataManager {
    constructor() {

       this.listQuestions = [];
       this.daysData = [];
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
            const questionCast = new Question(question);
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
            for (pairData of lArrayObjects) {
                const key = pairData[0]
                const object = pairData[1] != null ? JSON.parse(pairData[1]) : null;
                const keyDateOnly = key.split("@DataDay:").pop();
                this.daysData[keyDateOnly] = object;
            }
            if(this.answersUpdateCallback) {
                this.answersUpdateCallback();
            }
         });
        });

       this.saveListQuestions = function() {
            _storeData("@questions", this.listQuestions);
       }

       function getDateString(date) {
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
            const lDateStr = getDateString(date);
            const lTagStoring = "@DataDay:" + lDateStr;

            let lDayData = this.daysData[lDateStr];
            if(lDayData === undefined ) {
                lDayData = [];
            }

            lDayData[questionID] = value;
            this.daysData[lDateStr] = lDayData;

            _storeData(lTagStoring, lDayData);
            
            this.answersUpdateCallback();
       }

        /*
        * remove the data matching the question id at the given date..
        */
       this.removeData = function(questionID, date) {
            const lDateStr = getDateString(date);
            const lTagStoring = "@DataDay:" + lDateStr;

            let lDayData = this.daysData[lDateStr];
            if(lDayData === undefined ) {
                return
            }

            delete lDayData[questionID];

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

       this.addQuestion = function(aQuestionText, aQuestionType, aOptions, colour) {
           const lId = this.findAvailableId();
           let lQuestion = new Question({text:aQuestionText, type:aQuestionType, options:aOptions, colour, id:lId});
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
        const lIndex = getDateString(aDate);
        const dateData = this.daysData[lIndex];
        if(dateData !== undefined) {
            return dateData[aQuestionId];
        }
        return null;
       }

       this.getAllData = function() {
        return this.daysData;
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

class Question {
    constructor(data) {
        this.text = data.text;
        // id of the question type.
        this.type = data.type;
        this.options = data.options;
        if(data.colour === undefined) {
            data.colour = 0;
        }
        this.colour = data.colour;
        // unique id of the question.
        this.id = data.id;

        this.getText = function() {
            return this.text;
        }

        this.getColour = function() {
            return this.colour;
        }

        this.isNote = function() {
            return this.type == SharedConstants.questionTypes.QUESTION_TYPE_NOTE;
        }
    }
    
    setOptions(options) {
        for (const [key, value] of Object.entries(options)) {
            console.log(`${key}: ${value}`);
            this.options[key] = value;
        }
    }

    normalizeValue(aValue) {
        switch(+this.type) {
            case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
                return aValue;
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
                {
                const value = (aValue - this.options.min) / (this.options.max - this.options.min);
                return value;
                }
            case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
                {
                const value = aValue / 100;
                return value;
                }
            break;
            default:
                return 0;
        }
     }
}

export default new DataManager();