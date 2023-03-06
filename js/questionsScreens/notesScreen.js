import React, { useState, useEffect } from 'react';
import { Text, Image, StyleSheet, View, TouchableOpacity, Button, Dimensions, TouchableWithoutFeedback } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import Draggable from 'react-native-draggable';
import Utils from '../utils.js'
import HeaderDate from '../headerDate.js';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Svg, { Path } from 'react-native-svg';

const NotesScreen = ({navigation}) => {

  const windowWidth = Dimensions.get('window').width;

  const [arrayNotes, setArrayNotes] = React.useState([]);

  const updateNotes = () => {
    const arrayNotes = DataManager.getNotes();
    // we remove the questions that are the notes (they will be displayed in another screen)
    setArrayNotes(arrayNotes);
    // forceUpdate();
  }

  function getTextEmptyNotes() {
    if(!arrayNotes.length) {
      return (      
      <View style={{flex:1}}>
        <Text style={[styles.textEmpty, {fontSize:20, marginTop:"45%", fontWeight: 'bold'}]}>whoa so empty!</Text>
        <Text style={[styles.textEmpty, {fontSize:20, fontWeight: 'normal', marginBottom:20}]}>you can make notes too. they'll appear here.</Text>
        <Text style={styles.textEmpty}>Go to <Text style={{color: 'black', fontWeight: 'bold', fontSize:16}}><Icon color={"#555"} size={16} name={'plus'} />  Add New Question</Text> to add your first note.</Text>
      </View>);
    }
    else return null;
  }

  const editQuestion = (questionId) => {
    navigation.navigate("Answer Screen", questionId);
  }

  const openNoteEditor = (questionId) => {
    navigation.navigate("Question Editor", {questionID:questionId});
  }

  HeaderDate.addChangeCallback("AnswerNote",dateChanged);

  const forceUpdate = React.useReducer(() => ({}))[1]

  function dateChanged() {
      forceUpdate();
  }

  function getNoteLines(question) {
    let string = "";
    const value = DataManager.getAnswerForQuestion(question.id, HeaderDate.getDate());
    if(value) {
      string += value;
    }

    return string;
  }

  function getEmptyLines() {
    let string = "";
    for(let j = 0; j < 4; j++) {
      for(let i = 0; i < 64; i++) {
        string += " ";
      }
      string += "\n";
    }
    return string;
  }

  function getRandomRotate() {
    const angle = (Math.random() - 0.5) * 5;
    return angle + "deg"
  }

  function noteReleased(id, bounds) {
    const xRel = Math.round(100 * bounds.left / windowWidth);
    const yRel = Math.round(100 * bounds.top / windowWidth);
    const question = DataManager.getQuestionWithId(id);
    question.setOptions({x:xRel, y:yRel});
    DataManager.saveListQuestions();
  }

  function getPercentToPix(percent) {
    if((percent === undefined) || !percent) {
      return 50;
    }
    return windowWidth * (percent / 100);
  }  

  const listItems = arrayNotes.map((d) =>         
  <Draggable x={getPercentToPix(d.options.x)} y={getPercentToPix(d.options.y)} key={d.id} 
  onDragRelease={(event, gestureState, bounds)=>noteReleased(d.id, bounds)}
  onLongPress={()=>console.log('long press')}
  onShortPressRelease={()=>console.log('press drag')}
  onPressIn={()=>console.log('in press')}
  onPressOut={()=>console.log('out press')}>
    <TouchableWithoutFeedback onPress={()=>editQuestion(d.id)} onLongPress={()=>openNoteEditor(d.id)}
>
      <View style={[styles.noteContainer, {width:windowWidth * 0.3, height:windowWidth * 0.3, backgroundColor:Utils.increase_brightness(d.getColour(), 95), transform: [{ rotate: getRandomRotate() }]}]}>
        <View style={[styles.noteTitleContainer, {backgroundColor:Utils.increase_brightness(d.getColour(), 85)}]}>
          <Text style={styles.noteTitle} numberOfLines={2}>{d.text}</Text>
        </View>
        <Text style={styles.noteContent} multiline={true} numberOfLines={4}>{getNoteLines(d)}</Text>
        <Text style={[styles.noteContent, {textDecorationLine: 'underline', color: "#ddd",}]} multiline={true} numberOfLines={5}>{getEmptyLines()}</Text>
      </View>
    </TouchableWithoutFeedback>
  </Draggable>
  );

  useEffect(() => {
    updateNotes();
  }, []);

  return (
    <View style={{flex:2, flexDirection: "row", width:"100%", backgroundColor:"white"}}>
    <View style={{position:"absolute", elevation:2, zIndex:2, width:"100%", height:60}}>
      <Svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <Path fill="#fff" d="M26.3,-49.2C36.5,-39.7,48.8,-37.5,60.4,-30.5C72.1,-23.5,83,-11.8,83,0C83,11.7,72,23.5,60.3,30.4C48.7,37.3,36.3,39.4,26.1,48C16,56.6,8,71.8,-4,78.7C-16,85.7,-32,84.4,-42.7,76.1C-53.4,67.8,-58.8,52.5,-64.5,38.6C-70.1,24.7,-75.9,12.4,-75.4,0.3C-74.8,-11.7,-67.9,-23.4,-59.9,-33.3C-51.9,-43.1,-43,-51,-32.8,-60.5C-22.7,-70.1,-11.3,-81.2,-1.6,-78.4C8.1,-75.5,16.1,-58.7,26.3,-49.2Z" transform="translate(100 ,-40), scale(10.5,3.9), rotate(35)" />
      </Svg>
      </View>
      <View style={{position:"absolute", elevation:-1, zIndex:-1, width:"100%", height:"100%"}}>
      <Svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <Path fill="#efe8f3" d="M29.7,-52.8C37.6,-41.1,42.6,-31.4,48.4,-21.3C54.2,-11.2,61,-0.7,64.3,12.6C67.5,25.9,67.3,42,58.6,49.2C49.9,56.3,32.7,54.4,17.4,58.4C2.2,62.4,-11,72.4,-21.2,70.3C-31.4,68.1,-38.6,53.9,-49.1,42.3C-59.7,30.6,-73.6,21.6,-75.6,10.6C-77.5,-0.3,-67.5,-13.3,-59.9,-26.3C-52.3,-39.3,-47.2,-52.4,-37.6,-63.4C-28.1,-74.3,-14,-83.1,-1.6,-80.6C10.9,-78.2,21.8,-64.5,29.7,-52.8Z" transform="translate(200, 50), scale(2.,2)" />
      </Svg>
    </View>
    {getTextEmptyNotes()}
    {listItems}
    </View>
  )
}

const styles = StyleSheet.create({
  noteTitleContainer: {
    paddingBottom:5,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    height:40,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
  },

  noteTitle: {
    color:'#555',
    textAlign:'center',
    fontWeight: 'bold',
    marginHorizontal:3
  },

  noteContent: {
    color: "#999",
    marginHorizontal:3,
    position:"absolute",
    marginTop:40,
  },

  noteContainer: {
    borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },

  textEmpty:{
    color:'#333',
    textAlign:'center',
    marginHorizontal:3,
    fontSize:16,
  }
});

export default NotesScreen;