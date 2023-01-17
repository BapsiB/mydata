import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import React, { useState } from 'react';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';

export default QuestionButtonVizz = (props) => {

  const question = DataManager.getQuestionWithId(props.questionId);

  const [toggleValue, setToggleValue] = React.useState(DataManager.getQuestionVisibility());

  const openQuestionVisu = () => {

  };

  const VisibilityToggled = () => {
    const newValue = !toggleValue;
    setToggleValue(newValue);
    DataManager.setQuestionVisibility(question.id, newValue);
    props.changeCallback();
  };

  function getStyleColourButton() {
    if(toggleValue) {
      return [styles.colourButtton, {backgroundColor:question.getColour()}];
    }
    else {
      return [styles.colourButttonClosed, {backgroundColor:"#aaa"}]
    }
  }

  return (
  <View style={{flexDirection: "row", marginBottom:5, alignItems: 'center',}}>
    <View style={{flex:1}}>
    <TouchableOpacity onPress={VisibilityToggled}>
      <View style={getStyleColourButton()}>

      </View>
    </TouchableOpacity>
    </View>
    <View style={{flex:10}}>
    <TouchableOpacity style={[styles.questionsButtons, {textAlign: 'center', justifyContent: 'center',}]} onPress={()=>{openQuestionVisu();}}>
          <Text style={{fontSize: 16, color:"black", textAlign:'left', justifyContent: 'center'}}>
              {props.title}
          </Text>
    </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  questionsButtons: {
    marginVertical:3,
    marginHorizontal:5,
    paddingHorizontal:3,
    borderWidth:0,
    height:50,
    flex:1,
    borderRadius:10,
    borderColor:"black",
    justifyContent: 'left',
    textAlign: 'left',
    backgroundColor:"white",
    paddingHorizontal:10,
    paddingVertical:2,
    height:"100%"
  },

  colourButtton: {
    borderRadius:10,
    height:20,
    width:20,
    borderWidth:1,
    borderColor:"grey",
    justifyContent: 'center',
    textAlign: 'center',
  },

  colourButttonClosed: {
    // borderBottomRightRadius:10, 
    // borderBottomLeftRadius:10,
    borderRadius:8,
    height:16,
    width:16,
    marginLeft:2,
    marginTop:2,
    borderWidth:1,
    borderColor:"white",
    justifyContent: 'center',
    textAlign: 'center',
    borderTopWidth:0,
    opacity:0.3
  }
});