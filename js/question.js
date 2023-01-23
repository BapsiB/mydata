//import React from 'react';
import SharedConstants from './sharedConstants.js';

class Question {
    constructor(data, dataManager) {
        this.dataManager = dataManager;
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

    getStringifyiableObject() {
        return  {
            text: this.text,
            type: this.type,
            options:this.options,
            colour:this.colour,
            id:this.id
        }
    }
    
    setOptions(options) {
        for (const [key, value] of Object.entries(options)) {
            console.log(`${key}: ${value}`);
            this.options[key] = value;
        }
    }

    getArrayValues(normalizeValue) {
        if(normalizeValue === undefined) {
            normalizeValue = true;
        }
        const allData = this.dataManager.getAllData();

        let data = [];
        const that = this;
        allData.forEach((val, index) => {
          const dateStr = index.toString();
          // your code goes here 
          val.forEach((dayVal, questionIndex) => {
            if(that.id == dayVal.id) {
              const valNorm = normalizeValue ? this.normalizeValue(dayVal.v) : dayVal.v;
              if(dayVal.v) {
                const arrayEl = {date:that.dataManager.getDateFromString(dateStr), value:valNorm};
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