//import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SharedConstants from './sharedConstants.js';
import Question from './question.js';
import Datas from './datas'
import { call } from 'react-native-reanimated';

class DataManager {
    constructor() {

       this.questionsLoaded = false;
       this.listQuestions = [];
       this.questionsSettings = [];
       this.daysData = new Datas(this);
       this.questionCallback = [];
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
       /*
       * init all the data values stored in the local storage.
       */
        function init() {
            getData("@questions").then((data) => {
            if(data) {
              that.listQuestions = [];
              for (question of data) {
                  const questionCast = new Question(question, that);
                  that.listQuestions.push(questionCast);
              }
              that.updateQuestionsOrder();
            }
      
            that.questionsLoaded = true;
            that.callQuestionsCallbacks();

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
                that.daysData.clear();
                for (pairData of lArrayObjects) {
                    const key = pairData[0]
                    const object = pairData[1] != null ? JSON.parse(pairData[1]) : null;
                    const keyDateOnly = key.split("@DataDay:").pop();
    
                    const newObj = [];
    
                    that.daysData.set(keyDateOnly, object);
                }
                if(that.answersUpdateCallback) {
                    that.answersUpdateCallback();
                }
            });
            });
       }
      
       init();

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

        /*
        * return the datas as arrays ordered with time.
        * this is to use in a csv generation.
        */
        this.getQuestionsDataLinear = function() {
            // the first field if the column name question, that's for
            // the csv display.
            const container = {fields:["questions"], data:[]};

            const dateLimite = this.daysData.getMinMaxDates();
            var difference = dateLimite.max.getTime() - dateLimite.min.getTime();
            var days = Math.min(Math.ceil(difference / (1000 * 3600 * 24)), 10000);

            for(let i = 0; i < days; i++) {
                const lDate = new Date(dateLimite.min);
                const newDateStr = dateLimite.min.getDate() + i;
                lDate.setDate(newDateStr);
                const newDateStrDMFormat = this.getDateString(lDate);
                container.fields.push(newDateStrDMFormat);
            }

            for(let i in this.listQuestions) {
                let objQuestionI = [];
                // we add the question text column.
                objQuestionI.push(this.listQuestions[i].text);

                const dataQI = this.listQuestions[i].getArrayValues({normalizeValue:false});                
                for(let z = 1; z < container.fields.length; z++) {
                    const lDate = container.fields[z];
                    let foundIt = false;
                    for(let j in dataQI) {
                        const xx = dataQI[j];
                        if(!xx.date) {
                            continue;
                        }
                        const date = this.getDateString(xx.date);
                        if(date == lDate) {
                            objQuestionI.push(xx.value);
                            foundIt = true;
                        }
                    }
                    if(!foundIt) {
                        objQuestionI.push("");
                    }
                }
                container.data.push(objQuestionI);

            }
            return container;
            
        };

        this.callQuestionsCallbacks = () => {
            for(let i in this.questionCallback) {
                this.questionCallback[i]();
            }
        }

        this.saveListQuestions = function() {
            const lListSavable = [];
            for(const question of this.listQuestions) {
                lListSavable.push(question.getStringifyiableObject());
            }
            _storeData("@questions", lListSavable);
         }

        this.updateQuestionsOrder = function() {
            this.listQuestions.sort((a, b) => { 
                if (a.displayOrder < b.displayOrder) {
                  return -1;
                }
                if (a.displayOrder > b.displayOrder) {
                  return 1;
                }
                return 0;
            })
            this.callQuestionsCallbacks();
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
            this.daysData.set(lDateStr, lDayData);
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

            this.callQuestionsCallbacks();
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

        this.callQuestionsCallbacks();
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
                    this.callQuestionsCallbacks();
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

      this.getAppInfo = async () => {
        return await getData("@appstate")
      }

      this.saveAppInfo = (appInfoData) => {
        _storeData("@appstate", appInfoData);
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

       this.restore = function(objectToStore) {
        AsyncStorage.clear();
        for(let i in objectToStore) {
            const object = objectToStore[i];
            AsyncStorage.setItem(object[0], object[1]);
        }
        init();
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
               const currentQuestion = this.listQuestions[i];

               if(currentQuestion.id == questionId) {
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
                     return this.getNextQuestion(lQuestion.id, goForward, onlyTakeUnreplied, discardNotes, date);
                   }

                   if(onlyTakeUnreplied) {
                    const answer = this.getAnswerForQuestion(lQuestion.id, date);
                    if(answer == null) {
                        return lQuestion;
                    }
                    else {
                        return this.getNextQuestionUnrespondedInArray(i, date);
                    }
                   }
                   else {
                    return lQuestion;
                   }
                   
               }
           }

           return 
       }

       this.getNextQuestionUnrespondedInArray = function(aIndexInArray, date) {
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

        this.addQuestionsListener = function(stringId, callback){
            if(this.questionsLoaded) {
                callback();
            }
            this.questionCallback[stringId] = callback;
        }

        this.setAnswersUpdateListener = function (callback) {
            this.answersUpdateCallback = callback;
        }
    }
}

export default new DataManager();