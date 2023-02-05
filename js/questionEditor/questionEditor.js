import React, { useState } from 'react';
import { Text, Image, TextInput, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import QuestionType from './questionEditorType';
import QuestionOptions from './questionEditorOptions';

const QuestionEditor = (props) => {

  // the question we want to edit. null if new.
  let fromQuestion = null;
  let lQuestionType = 0;
  if(props.route.params) {
    if(props.route.params.questionID !== undefined) {
      fromQuestion = DataManager.getQuestionWithId(props.route.params.questionID);
      lQuestionType = fromQuestion.type;
    }
    else if(props.route.params.startType !== undefined) {
      lQuestionType =props.route.params.startType;
    }
  }

  const [questionText, onChangeQuestionText] = React.useState(fromQuestion ? fromQuestion.text : "");
  const [questionType, onChangeQuestionType] = React.useState(lQuestionType);
  const [options, onSetOptions] = React.useState(fromQuestion ? fromQuestion.options : {});
  const [colour, onSetColour] = React.useState(fromQuestion && fromQuestion.getColour() ? fromQuestion.getColour() : getRandomColour());

function getRandomColour() {
  const index = Math.round(Math.random() * SharedConstants.coloursSet.length);
  return SharedConstants.coloursSet[index]
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
        case SharedConstants.questionTypes.QUESTION_TYPE_NOTE:
          lOption = {};
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
              numberOfLines={1} 
              style={styles.input}
              onChangeText={onChangeQuestionText}
              value={questionText}
              placeholder={getQuestionExample(questionType)}
              placeholderTextColor='#888'
            />
        </View>
        <View style={{flex: 3}}>
          <QuestionType enabled={!fromQuestion} style={styles.questionType} onChange={onChangeQuestionType} questionTypeId={questionType} />
          <QuestionOptions style={{marginTop:20}} onChange={(options) => {onSetOptions(options);}} questionTypeId={questionType} initOptions={options}/>
          <QuestionColour onChange={onColourChange} initColour={colour}/>
        </View>
      </View>
        <View style={{margin: 20, height:50, bottom:10, alignItems: 'center',}}>
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
    lNotesQuestions = [];
    lYesNoQuestions.push("did you remember your dream?");
    lYesNoQuestions.push("did you drink alcohol?");
    lYesNoQuestions.push("have you talked to a friend?");
    lQuestions.push(lYesNoQuestions);
    lQuantityQuestions.push("how many coffees today?");
    lQuantityQuestions.push("how many hours was I outside?");
    lQuantityQuestions.push("how many gram of sugar eaten?");
    lQuestions.push(lQuantityQuestions);
    lIntensityQuestions.push("how tense did you feel?");
    lIntensityQuestions.push("how happy did you feel?");
    lIntensityQuestions.push("how easy was it to sleep?");
    lQuestions.push(lIntensityQuestions);
    lNotesQuestions.push("choose a title for that note");
    lNotesQuestions.push("choose a title for that note");
    lNotesQuestions.push("choose a title for that note");
    lQuestions.push(lNotesQuestions);
    return "eg: " + lQuestions[questionType][lRandom];
}

const QuestionColour = ({onChange, initColour}) => {
  const [displayColourWheel, setDisplayColourWheel] = React.useState(false);
  
  function onColourSelect(colour) {
    onChange(colour);
  }

  // {displayColourWheel &&
  //   <ColorPicker
  //     style={{marginHorizontal:10}}
  //     discrete={false}
  //     swatchesOnly={false}
  //     onColorChangeComplete={colour =>{onColourSelect(colour)}}
  //     color={initColour}
  //     swatches={false}
  //     shadeWheelThumb={false}
  //     shadeSliderThumb={false}
  //     sliderHidden={true}
  //   ></ColorPicker>
  //   }


  const windowWidth = Dimensions.get('window').width;
  const widthRow = windowWidth;
  const marginTile = 10;
  const widthTile = (windowWidth - 6 * marginTile) / 5;
  const heightTile = widthTile * 0.7;
  const heightRow = heightTile;

  return (
    <View style={{flex: 3}}>
    <TouchableOpacity style={[styles.button_colour]} onPress={()=>{setDisplayColourWheel(!displayColourWheel);}}>
      <View style={{ width:50, height:50,  borderRadius:25, backgroundColor:initColour,  }} source={require("../../resources/arrowL.png")}/>
    </TouchableOpacity>

    <View style={{flexDirection:"column", alignItems:"center", height:heightRow * 2}}>
      <View style={{flexDirection:"row", height:heightRow, margin:marginTile}}>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[0]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[1]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[2]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[3]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[4]}/>
      </View>
      <View style={{flexDirection:"row", height:heightRow, margin:marginTile}}>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[5]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[6]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[7]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[8]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[9]}/>
      </View>
    </View>
    </View>
  );
}

const QuestionColourSample = ({onClick, colour}) => {
  
  return (
    <TouchableOpacity onPress={()=>{onClick(colour);}}>
      <View style={[styles.colourSample, {backgroundColor:colour}]}></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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

    minMaxInput: {
      marginTop: 5,
      marginLeft: 50,
      marginRight: 50,
      textAlignVertical:'center',
      textAlign:'center',
      bottom:0
  },

    colourSample: {
      height:"100%",
      width:"80%",
      borderRadius:10,
      borderColor:"grey",
      marginHorizontal:"10%",
      marginTop:"-5%"
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

    textTopMinMax: {
        color: 'black',
        fontWeight:'normal',
        fontSize:20,
        textAlignVertical:'center',
        textAlign:'center',
    },

    button_colour: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      marginBottom: 20,
    },

    questionType: {
      margin: 12,
      borderWidth: 1,
      padding: 10,
      bottom:0,
      flex: 2,
    },
});

export default QuestionEditor;