import React, { useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';
import QuestionEditor from '../questionEditor/questionEditor.js';
import {QuestionButtonEdit} from '../questionButton'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createStackNavigator
} from '@react-navigation/stack';

const EditQuestionsScreen = ({navigation}) => {
  const StackIn = createStackNavigator();

  return (

    <View style={{ flex: 1}}>
      <StackIn.Navigator initialRouteName={"Questions List Editor"}>
        <StackIn.Screen name="Question Editor 2" component={QuestionEditor} options={{ headerShown:false }}/>
        <StackIn.Screen name="Questions List Editor" component={EditQuestionsList} options={{ headerShown:false }}/>
      </StackIn.Navigator>
    </View>
  )
}

const EditQuestionsList = ({navigation}) => {
  
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
    navigation.navigate("Question Editor 2", {questionID:questionId});
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

  const listItems = arrayQuestions.map((d) => <QuestionButtonEdit title={d.text} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButtonEdit>);

  return (
    <View style={{flex:1, backgroundColor:"white"}}>
      {getTextEmptyQuestion()}
    <ScrollView style={{marginBottom:"17%"}}>
      <View style={{height:15,}}/>
        {listItems}
      <View style={{height:15}}/>
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

export default EditQuestionsScreen;