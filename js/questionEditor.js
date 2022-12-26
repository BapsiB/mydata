import React, { useState } from 'react';
import { Text, Image, TextInput, StyleSheet, View, TouchableOpacity, Button } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import ColorPicker from 'react-native-wheel-color-picker'

const QuestionEditor = (props) => {
  // the question we want to edit. null if new.
  let fromQuestion = null;
  if(props.route.params)
  if(props.route.params.questionID !== undefined) {
    fromQuestion = DataManager.getQuestionWithId(props.route.params.questionID);
  }

  const [questionText, onChangeQuestionText] = React.useState(fromQuestion ? fromQuestion.text : "");
  const [questionType, onChangeQuestionType] = React.useState(fromQuestion ? fromQuestion.type : 0);
  const [options, onSetOptions] = React.useState(fromQuestion ? fromQuestion.options : {});
  const [colour, onSetColour] = React.useState(fromQuestion && fromQuestion.colour ? fromQuestion.colour : getRandomColour());

function getRandomColour() {
  return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function onColourChange(newColour) {
  onSetColour(newColour);
}

function onPressAddQuestion() {
    let lOption;
    switch(questionType) {
        case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
            lOption = {};
        break;
        case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
            lOption = options.number;
        break;
        case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
            lOption = options.intensity;
        break;
    }

    if(fromQuestion) {
      DataManager.updateQuestion(fromQuestion.id, questionText, questionType, lOption, colour);
    }
    else {
      DataManager.addQuestion(questionText, questionType, lOption, colour);
    }
    
    props.navigation.navigate("Home");
}

const lDisableAddButton = questionText.length == 0;

  return (
    <View style={{ flex: 1}}>
      <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{flex: 1}}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeQuestionText}
              value={questionText}
              placeholder={getQuestionExample(questionType)}
              placeholderTextColor='#888'
            />
        </View>
        <View style={{flex: 2}}>
          <QuestionType enabled={!fromQuestion} style={styles.questionType} onChange={(index) => {onChangeQuestionType(index);}} questionTypeId={questionType} />
          <QuestionOptions onChange={(options) => {onSetOptions(options);}} questionTypeId={questionType} initOptions={options}/>
          <QuestionColour onChange={onColourChange} initColour={colour}/>
        </View>
      </View>
        <View style={{margin: 50, height:50, bottom:30, alignItems: 'center',}}>
        <TouchableOpacity disabled={lDisableAddButton} style={[styles.addButtonStyle, {opacity: lDisableAddButton ? 0.3 : 1}]} onPress={()=>{onPressAddQuestion();}}>
            <Text style={{color:"black"}}>{fromQuestion ? "UPDATE" : "ADD"}</Text>
        </TouchableOpacity>
       </View>
    </View>
  );
}

function getQuestionExample(questionType) {
    const lRandom = Math.floor(Math.random() * 3);
    let lQuestions = [];
    lYesNoQuestions = [];
    lQuantityQuestions = [];
    lIntensityQuestions = [];
    lYesNoQuestions.push("did you remember your dream?");
    lYesNoQuestions.push("did you drink alcohol?");
    lYesNoQuestions.push("have you talked to a friend?");
    lQuestions.push(lYesNoQuestions);
    lQuantityQuestions.push("how many coffees today?");
    lQuantityQuestions.push("how many hours did you spend outside?");
    lQuantityQuestions.push("how many gram of sugar did you eat?");
    lQuestions.push(lQuantityQuestions);
    lIntensityQuestions.push("how tense did you feel?");
    lIntensityQuestions.push("how happy did you feel?");
    lIntensityQuestions.push("how easy was it to sleep?");
    lQuestions.push(lIntensityQuestions);
    return "eg: " + lQuestions[questionType][lRandom];
}

const QuestionType = ({questionTypeId, onChange, enabled}) => {

    let lTextTop;
    let lSubText;
    switch(questionTypeId) {
        case 0:
            lTextTop = "yes/no";
            lSubText = "the answer can be yes or no."
            break;
        case 1:
            lTextTop = "quantity";
            lSubText = "the answer is a number."
            break;
        case 2:
            lTextTop = "intensity";
            lSubText = "for things that cannot be numbered."
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
          <Image style={{ width:50, height:50,  resizeMode: 'stretch' }} source={require("../resources/arrowLeft.png")}/>
        </TouchableOpacity>
        </View>
        <View style={{flex:4, flexDirection: "column"}}>
            <Text style={styles.textTop}>{lTextTop}</Text>
            <Text style={styles.textSub}>{lSubText}</Text>
        </View>
        <View style={{flex:1}}>
        <TouchableOpacity style={[styles.button_footer,  enabled ? null : styles.disabled]} disabled={!enabled} onPress={()=>{nextQuestion();}}>
          <Image style={{ width:50, height:50,  resizeMode: 'stretch' }} source={require("../resources/arrowRight.png")}/>
        </TouchableOpacity>
        </View>
    </View>

        )
}

const QuestionOptions = ({questionTypeId, onChange, initOptions}) => {

    switch(questionTypeId) {
        case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
        return (<View/>)
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
                <View style={{flex:2, flexDirection: "row"}}>
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
        <View style={{flex:2, flexDirection: "row"}}>
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

const QuestionColour = ({onChange, initColour}) => {
  const [displayColours, setDisplayColours] = React.useState(false);

  return (
    <View style={{flex: 2}}>
    <TouchableOpacity style={[styles.button_colour, null]} onPress={()=>{setDisplayColours(!displayColours);}}>
      <View style={{ width:50, height:50,  borderRadius:25, backgroundColor:initColour }} source={require("../resources/arrowLeft.png")}/>
    </TouchableOpacity>
    <ColorPicker
      style={{opacity: displayColours ? 1 : 0, marginHorizontal:10}}
      discrete={true}
      swatchesOnly={true}
      discreteLength={12}
      palette={['#000000','#888888','#ed1c24','#d11cd5','#1633e6','#00aeef','#00c85d','#57ff0a','#ffde17','#f26522','#ffffff', '#888888']}
      onColorChangeComplete={colour =>{onChange(colour)}}
    ></ColorPicker>
    </View>
  );
}


const styles = StyleSheet.create({
    input: {
    height:40,
    marginTop: 50,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    padding: 10,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    fontSize: 20,
    color: 'black',
    },

    addButtonStyle: {
        height:50,
        width:130,
        backgroundColor: 'black',
        color:"black",
        alignItems: 'center',
        backgroundColor:"white",
        borderWidth:1,
        borderRadius:10,
        textAlignVertical:'center',
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    minMaxInput: {
        marginTop: 5,
        marginLeft: 50,
        marginRight: 50,
        textAlignVertical:'center',
        textAlign:'center',
    },

    textTopMinMax: {
        color: 'black',
        fontWeight:'normal',
        fontSize:20,
        textAlignVertical:'center',
        textAlign:'center',
    },

    questionType: {
      margin: 12,
      borderWidth: 1,
      padding: 10,
      bottom:0,
      flex: 2,
    },

    button_footer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,

    },

    button_colour: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      marginBottom: 20,
    },

    textTop: {
        fontWeight:'bold',
        fontSize:30,
        textAlignVertical:'center',
        textAlign:'center',
        color: 'black',
//        justifyContent: 'center',
//        alignItems: 'center',
    },

        textSub: {
            fontWeight:'normal',
            fontSize:20,
            textAlignVertical:'center',
            textAlign:'center',
            color: 'black',
    //        justifyContent: 'center',
    //        alignItems: 'center',
        },

    questionTypeContainer: {
        flex: 1,
        flexDirection: "row",
    },

    disabled: {
      opacity:0
  }
});

export default QuestionEditor;