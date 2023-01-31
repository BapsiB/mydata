import React, {useEffect, useState} from "react";
import { StyleSheet, View, Dimensions, ScrollView, Text } from "react-native";

import DataManager from '../dataManager.js';
import RepartitionGraph from './repartitionGraph.js'
import TextDataExtraction from './textDataExtraction'
import SingleQuestionTimeGraph from './singleQuestionTimeGraph'
import { parseSync } from "@babel/core";

const DataVisualisationSingleQuestion = (props) => {

  const question = DataManager.getQuestionWithId(props.route.params.questionId);

  const data = question.getArrayValues(false);
  
  return (
    <View style={{flex:1}}>
    <Text style={styles.questionText}
        adjustsFontSizeToFit={true}
        numberOfLines={2}
    >{question.text}</Text>
    
    <ScrollView style={{flex:1}} scrollEnabled={false}>
    <SingleQuestionTimeGraph data={data} questionId={question.id}/>
    <View style={[styles.container, {zIndex:0}]}>
      <RepartitionGraph data={data} question={question}/>
    </View>
    <View style={[styles.container, {zIndex:0, padding:20}]}>
    <TextDataExtraction data={data} style={{
      zIndex: -1,
      elevation: -1,
    }}/>
    </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    borderColor:"grey",
    backgroundColor:"#f8f8f8",
    margin:5,
    borderWidth:0,
    borderRadius:10,
     // 1 for stacking the element on top of the previous element and -1 
             // for stacking the element under the above previous element.
    elevation: 1,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,


    // justifyContent: "center",
    // alignItems: "center",
  },

  questionText: {
    marginVertical:0,
    marginHorizontal:20,
    marginBottom:10,
    color: 'black',
    fontSize: 25,
    fontWeight: '500',
    marginTop:20,
    textAlignVertical:'center',
    textAlign:'center',
},
 });

export default DataVisualisationSingleQuestion;