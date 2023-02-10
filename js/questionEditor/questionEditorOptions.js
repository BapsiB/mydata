import React, {  } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import SharedConstants from '../sharedConstants.js';

const QuestionOptions = ({questionTypeId, onChange, initOptions}) => {

  switch(questionTypeId) {
      case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
      return (<View style={{flex:2}}/>)
      break;
      case SharedConstants.questionTypes.QUESTION_TYPE_NOTE:
        return (<View style={{flex:2}}/>)
      break;
      case SharedConstants.questionTypes.QUESTION_TYPE_COLOUR:
        return (<View style={{flex:2}}/>)
      break;
      case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
              if(initOptions.intensity === undefined) {
                  initOptions.intensity = {};
              }

              if(initOptions.intensity.min === undefined) {
                  initOptions.intensity.min = "";
              }

              if(initOptions.intensity.max === undefined) {
                  initOptions.intensity.max = "";
              }
              return (
              <View style={{flex:2, flexDirection: "row", marginTop:30,}}>
                  <View style={{flex:1, flexDirection: "column"}}>
                    <Text style={styles.textTopMinMax}>from</Text>
                    <TextInput
                      style={[styles.input, styles.minMaxInput]}
                      onChangeText={text =>{ initOptions.intensity.min = text; onChange(initOptions)}}
                      defaultValue={initOptions.intensity.min}
                      placeholder="optional"
                      placeholderTextColor='#888'
                      keyboardType="characters"
                    />
                  </View>
                  <View style={{flex:1, flexDirection: "column"}}>
                    <Text style={styles.textTopMinMax}>to</Text>
                    <TextInput
                      style={[styles.input, styles.minMaxInput]}
                      onChangeText={text =>{ initOptions.intensity.max = text; onChange(initOptions)}}
                      defaultValue={initOptions.intensity.max}
                      placeholder="optional"
                      placeholderTextColor='#888'
                      keyboardType="characters"
                    />
                  </View>
              </View>
              )
      case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
      if(initOptions.number === undefined) {
          initOptions.number = {};
      }

      if(initOptions.number.min === undefined) {
          initOptions.number.min = "0";
      }

      if(initOptions.number.max === undefined) {
          initOptions.number.max = "10";
      }

      return (
        <View style={{flex:2, flexDirection: "row", marginTop:30,}}>
        <View style={{flex:1, flexDirection: "column"}}>
          <Text style={styles.textTopMinMax}>from</Text>
            <TextInput
              style={[styles.input, styles.minMaxInput]}
              onChangeText={text =>{ initOptions.number.min = text; onChange(initOptions)}}
              defaultValue={initOptions.number.min}
              keyboardType="numeric"
            />
          </View>
          <View style={{flex:1, flexDirection: "column"}}>
            <Text style={styles.textTopMinMax}>to</Text>
            <TextInput
              style={[styles.input, styles.minMaxInput]}
              onChangeText={text =>{ initOptions.number.max = text; onChange(initOptions)}}
              defaultValue={initOptions.number.max}
              keyboardType="numeric"
            />
          </View>
      </View>
      )
      break;
  }
}

const styles = StyleSheet.create({

textTopMinMax: {
  color: 'black',
  fontWeight:'normal',
  fontSize:20,
  textAlignVertical:'center',
  textAlign:'center',
},

minMaxInput: {
  marginTop: 5,
  marginLeft: 50,
  marginRight: 50,
  textAlignVertical:'center',
  textAlign:'center',
  bottom:0
},

input: {
  height:30,
  marginTop: 50,
  marginLeft: 12,
  marginRight: 12,
  borderWidth: 1,
  padding: 0,
  borderTopColor: "transparent",
  borderLeftColor: "transparent",
  borderRightColor: "transparent",
  fontSize: 20,
  color: 'black',
  },

})

export default QuestionOptions;