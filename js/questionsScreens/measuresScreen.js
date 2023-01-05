import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Button, ScrollView } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';

const MeasuresScreen = ({navigation}) => {

  const updateQuestions = () => {
    setArrayQuestions(DataManager.getQuestions());
    forceUpdate();
  }

  const forceUpdate = React.useReducer(() => ({}))[1]

  const answersLoadedCallback = () => {
    forceUpdate();
  }

  const editQuestion = (questionId) => {
    navigation.navigate("Question Editor", {questionID:questionId});
  }

  DataManager.setQuestionsListener(updateQuestions);
  DataManager.setAnswersLoadedListener(answersLoadedCallback);

  const [arrayQuestions, setArrayQuestions] = React.useState([]);

  const listItems = arrayQuestions.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButton>);

  return (
    <ScrollView style={{marginBottom:"21%"}}>
      <SwipeProvider>
        {listItems}
      </SwipeProvider>
    </ScrollView>
  )
}

const styles = StyleSheet.create({

});

export default MeasuresScreen;