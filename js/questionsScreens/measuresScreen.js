import React, { useState } from 'react';
import { Text, Image, TextInput, StyleSheet, View, TouchableOpacity, Button } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';

const MeasuresScreen = ({}) => {

  const updateQuestions = () => {
    setArrayQuestions(DataManager.getQuestions());
    forceUpdate();
  }

  DataManager.setQuestionsListener(updateQuestions);
  DataManager.setAnswersLoadedListener(answersLoadedCallback);

  const [arrayQuestions, setArrayQuestions] = React.useState([]);

  const listItems = arrayNames.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButton>);

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