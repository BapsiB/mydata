import React, {  } from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import SharedConstants from './sharedConstants.js';

const QuestionType = ({questionTypeId, onChange, enabled}) => {

  let lTextTop;
  let lSubText;
  switch(questionTypeId) {
      case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
          lTextTop = "yes/no";
          lSubText = "the answer can be yes or no."
          break;
      case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
          lTextTop = "quantity";
          lSubText = "the answer is a number."
          break;
      case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
          lTextTop = "intensity";
          lSubText = "it cannot be numbered."
          break;
      case SharedConstants.questionTypes.QUESTION_TYPE_NOTE:
        lTextTop = "notes";
        lSubText = "classic text journal content."
        break;
  }

  const nextQuestion = () =>
  {
      const value = (questionTypeId + 1) % SharedConstants.questionTypes.QUESTION_TYPE_COUNT;
      onChange(value);
  }

  const prevQuestion = function() {
      const value = (questionTypeId == 0) ? SharedConstants.questionTypes.QUESTION_TYPE_COUNT - 1 : questionTypeId - 1;
      onChange(value);
  }

  return (
  <View style={[styles.questionTypeContainer]}>
      <View style={{flex:1}}>
      <TouchableOpacity style={[styles.button_footer,  enabled ? null : styles.disabled]} disabled={!enabled} onPress={()=>{prevQuestion();}}>
        <Image style={{ width:50, height:50,  resizeMode: 'stretch' }} source={require("../resources/arrowL.png")}/>
      </TouchableOpacity>
      </View>
      <View style={{flex:5, flexDirection: "column"}}>
          <Text style={styles.textTop}>{lTextTop}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.textSub}>{lSubText}</Text>
      </View>
      <View style={{flex:1}}>
      <TouchableOpacity style={[styles.button_footer,  enabled ? null : styles.disabled]} disabled={!enabled} onPress={()=>{nextQuestion();}}>
        <Image style={{ width:50, height:50,  resizeMode: 'stretch' }} source={require("../resources/arrowR.png")}/>
      </TouchableOpacity>
      </View>
  </View>

      )
}

const styles = StyleSheet.create({
  questionTypeContainer: {
    flex: 1,
    flexDirection: "row",
},

button_footer: {
  justifyContent: 'center',
  alignItems: 'center',
  height: 50,

},

disabled: {
  opacity:0
},

textTop: {
  fontWeight:'bold',
  fontSize:30,
  textAlignVertical:'center',
  textAlign:'center',
  color: 'black',
},

textSub: {
  fontWeight:'normal',
  fontSize:20,
  height:30,
  textAlignVertical:'center',
  textAlign:'center',
  color: 'black',
},
})

export default QuestionType;