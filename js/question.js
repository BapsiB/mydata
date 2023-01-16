//import React from 'react';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';

class Question {
    constructor(data) {
        this.text = data.text;
        // id of the question type.
        this.type = data.type;
        this.options = data.options;
        console.log("data.colour bef " + data.colour);
        if(data.colour !== undefined) {
            if(String(data.colour).length <= 2) {
                data.colour = SharedConstants.coloursSet[+data.colour];
            }
        }
        else {
            data.colour = SharedConstants.coloursSet[0];
        }
        console.log("data.colour aft " + data.colour);
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

    getArrayValues() {
        const allData = DataManager.getAllData();

        let data = [];
        allData.forEach((val, index) => {
          const dateStr = index.toString();
          // your code goes here 
          val.forEach((dayVal, questionIndex) => {
            if(this.index && questionIndex) {
              const valNorm = this.normalizeValue(dayVal);
              if(dayVal) {
                const arrayEl = {date:DataManager.getDateFromString(dateStr), value:valNorm};
                data.push(arrayEl);
              }
            }
          })
        })
        return data;
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

export default Question;