//import React from 'react';
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SharedConstants {
    constructor() {

       this.questionTypes = {
        QUESTION_TYPE_YES_NO: 0,
        QUESTION_TYPE_NUMBER: 1,
        QUESTION_TYPE_INTENSITY: 2,
        QUESTION_TYPE_COUNT: 3
       };
  }
}

export default new SharedConstants();