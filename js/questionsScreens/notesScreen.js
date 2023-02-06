import React, { useState, useEffect } from 'react';
import { Text, Image, StyleSheet, View, TouchableOpacity, Button, Dimensions, TouchableWithoutFeedback } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import Draggable from 'react-native-draggable';
import Utils from '../utils.js'
import HeaderDate from '../headerDate.js';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
    navigation.replace("Answer Screen", questionId);
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
    <View style={{flex:2, flexDirection: "row", width:"100%"}}>
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