import { Text, StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';
import QuestionButtonVizz from './questionButton.js';

export default QuestionVizzList = (props) => {

  const [arrayQuestions, setArrayQuestions] = React.useState([]);
  useEffect(() => {
    updateQuestions();
}, []);

  function getListItems() {
     const listItems = arrayQuestions.map((d) => <QuestionButtonVizz title={d.text} questionId={d.id} key={d.id} navigation={props.navigation} changeCallback={props.changeCallback}></QuestionButtonVizz>);
     return listItems;
  }

  const updateQuestions = () => {
    const arrayQuestionsOrigin = DataManager.getQuestions();
    setArrayQuestions(arrayQuestionsOrigin);
    forceUpdate();
  }

  const forceUpdate = React.useReducer(() => ({}))[1]

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={{flex:3}}>
        <View style={{height:15}}/>
        {getListItems()}
        <View style={{height:15}}/>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal:20,
    //   justifyContent: "center",
    //   alignItems: "center",
    }
   });
