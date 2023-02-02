import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Button, ScrollView } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';
import QuestionButton from '../questionButton'
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';

const MeasuresScreen = ({navigation, date}) => {

  useEffect(() => {
    updateQuestions();
}, []);

  const updateQuestions = () => {
    const arrayQuestionsOrigin = DataManager.getQuestions();
    // we remove the questions that are the notes (they will be displayed in another screen)
    const filtered = arrayQuestionsOrigin.filter((question) => {return question.type != SharedConstants.questionTypes.QUESTION_TYPE_NOTE});
    setArrayQuestions(filtered);
    forceUpdate();
  }
  
  const forceUpdate = React.useReducer(() => ({}))[1]

  const updateAnswer = () => {
    forceUpdate();
  }

  const editQuestion = (questionId) => {
    navigation.navigate("Question Editor", {questionID:questionId});
  }

  function getTextEmptyQuestion() {
    if(!listItems.length) {
      return (      
      <View>
        <Text style={[styles.textEmpty, {fontSize:20, marginTop:"45%", fontWeight: 'bold'}]}>your list of questions is empty.</Text>
        <Text style={styles.textEmpty}>Press <Text style={{color: 'black', fontWeight: 'bold', fontSize:18}}>+</Text> to add your first question.</Text>
      </View>);
    }
    else return null;
  }

  DataManager.setAnswersUpdateListener(updateAnswer);
  HeaderDate.addChangeCallback("MeasureScreen", updateAnswer);

  const [arrayQuestions, setArrayQuestions] = React.useState([]);

  const listItems = arrayQuestions.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButton>);

  return (
    <View style={{flex:1}}>
      {getTextEmptyQuestion()}
    <ScrollView style={{marginBottom:"17%"}}>
      <SwipeProvider>
        <View style={{height:15}}/>
        {listItems}
        <View style={{height:15}}/>
      </SwipeProvider>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  textEmpty:{
    color:'#333',
    textAlign:'center',
    marginHorizontal:3,
    fontSize:16,
  }
});

export default MeasuresScreen;