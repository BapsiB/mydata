import React, { useState } from 'react';
import { Text, Image, TextInput, StyleSheet, View, TouchableOpacity, Button } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';

const QuestionsEditor = (props) => {

  const openQuestionEditor = () => {
    
  }

  const listItems = arrayNames.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={openQuestionEditor}></QuestionButton>);
  
  return (
    <View style={styles.questionTypeContainer}>

    </View>
  )
}

const styles = StyleSheet.create({

});

export default QuestionsEditor;