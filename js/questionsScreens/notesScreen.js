import React, { useState, useEffect } from 'react';
import { Text, Image, StyleSheet, View, TouchableOpacity, Button, Dimensions, TouchableWithoutFeedback } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import Draggable from 'react-native-draggable';
import Utils from '../utils.js'
import headerDate from '../headerDate.js';

const NotesScreen = ({navigation}) => {

  const windowWidth = Dimensions.get('window').width;

  const [arrayNotes, setArrayNotes] = React.useState([]);

  const updateNotes = () => {
    const arrayNotes = DataManager.getNotes();
    // we remove the questions that are the notes (they will be displayed in another screen)
    setArrayNotes(arrayNotes);
    // forceUpdate();
  }

  const editQuestion = (questionId) => {
    navigation.navigate("Answer Screen", questionId);
  }

  const forceUpdate = React.useReducer(() => ({}))[1]

  function getNoteLines(question) {
    let string = "";
    const value = DataManager.getAnswerForQuestion(question.id, headerDate.getDate());
    if(value) {
      string += value;
    }

    return string;
  }

  function getEmptyLines() {
    let string = "";
    for(let j = 0; j < 5; j++) {
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

  const listItems = arrayNotes.map((d) =>         
  <Draggable x={50} y={50} key={d.id} 
  onDragRelease={()=>console.log('drag release')}
  onLongPress={()=>console.log('long press')}
  onShortPressRelease={()=>console.log('press drag')}
  onPressIn={()=>console.log('in press')}
  onPressOut={()=>console.log('out press')}>
    <TouchableWithoutFeedback onPress={()=>editQuestion(d.id)}>
      <View style={[styles.noteContainer, {width:windowWidth * 0.3, height:windowWidth * 0.3, backgroundColor:Utils.increase_brightness(d.colour, 95), transform: [{ rotate: getRandomRotate() }]}]}>
        <Text style={[styles.noteTitle, {backgroundColor:Utils.increase_brightness(d.colour, 85)}]}>{d.text}</Text>
        <Text style={styles.noteContent} multiline={true} numberOfLines={5}>{getNoteLines(d)}</Text>
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
    {listItems}
    </View>
  )
}

const styles = StyleSheet.create({
  noteTitle: {
    textAlign:'center',
    fontWeight: 'bold',
    fontFamily:"Cochin",
    paddingBottom:5,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },

  noteContent: {
    color: "#999",
    marginHorizontal:3,
    position:"absolute",
    marginTop:25,
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
});

export default NotesScreen;