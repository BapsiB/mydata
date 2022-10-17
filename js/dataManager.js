//import React from 'react';
import { Text } from 'react-native';

export default class DataManager {
                 constructor(aAnimalType) {
                   this.animalType = aAnimalType;

                   this.describeAnimalType = function() {
                       return "this is a " + this.animalType;
                   }
                 }
               }