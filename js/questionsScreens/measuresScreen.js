import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Button, ScrollView } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';
import QuestionButton from '../questionButton'
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';
import Svg, { Path } from 'react-native-svg';

const MeasuresScreen = ({navigation, date}) => {

  useEffect(() => {
    DataManager.addQuestionsListener("MeasuresScreen", updateQuestions);
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
    <View style={{flex:1, backgroundColor:"white"}}>
      <View style={{position:"absolute", elevation:2, zIndex:2, width:"100%", height:60}}>
      <Svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <Path fill="#fff" d="M26.3,-49.2C36.5,-39.7,48.8,-37.5,60.4,-30.5C72.1,-23.5,83,-11.8,83,0C83,11.7,72,23.5,60.3,30.4C48.7,37.3,36.3,39.4,26.1,48C16,56.6,8,71.8,-4,78.7C-16,85.7,-32,84.4,-42.7,76.1C-53.4,67.8,-58.8,52.5,-64.5,38.6C-70.1,24.7,-75.9,12.4,-75.4,0.3C-74.8,-11.7,-67.9,-23.4,-59.9,-33.3C-51.9,-43.1,-43,-51,-32.8,-60.5C-22.7,-70.1,-11.3,-81.2,-1.6,-78.4C8.1,-75.5,16.1,-58.7,26.3,-49.2Z" transform="translate(100 ,-40), scale(10.5,3.9), rotate(35)" />
      </Svg>
      </View>
      <View style={{position:"absolute", elevation:-1, zIndex:-1, width:"100%", height:"100%"}}>
      <Svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <Path fill="#fff3f3" d="M 000 150 s 0 200 150 200 s 250 -300 500 -100 s 500 -450 400 -650 s 100 550 100 550" transform="translate(-100, -250), scale(1.,1)" />
      </Svg>
      </View>
      {getTextEmptyQuestion()}
    <ScrollView style={{marginBottom:"17%"}} showsHorizontalScrollIndicator={false}>
      <SwipeProvider>
        <View style={{height:65}}/>
        <View style={{height:15,}}/>
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