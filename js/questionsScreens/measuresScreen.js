import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';
import QuestionButton from '../questionButton'
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';
import Svg, { Path } from 'react-native-svg';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const MeasuresScreen = ({navigation, date}) => {

  useEffect(() => {
    DataManager.addQuestionsListener("MeasuresScreen", updateQuestions);
  }, []);

  const allQuestionsAnswered = DataManager.getNextQuestionUnrespondedInArray(0, HeaderDate.getDate()) ? false : true;

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

  function replyAllQuestions() {
    const question = DataManager.getNextQuestionUnrespondedInArray(0, HeaderDate.getDate());
    navigation.navigate("Answer Screen", { id: question.id, onlyTakeUnanswered:true} );
  }

  DataManager.setAnswersUpdateListener(updateAnswer);
  HeaderDate.addChangeCallback("MeasureScreen", updateAnswer);

  const [arrayQuestions, setArrayQuestions] = React.useState([]);

  const listItems = arrayQuestions.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButton>);

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Image style={{resizeMode: 'cover', width:"100%", height:"100%", position:"absolute"}} source={require("../../resources/background.jpg")}></Image>
      <View style={{position:"absolute", elevation:2, zIndex:2, width:"100%", height:60, backgroundColor:"white"}}>

      </View>
      <View style={{position:"absolute", elevation:-1, zIndex:-1, width:"100%", height:"100%"}}>
      {/* <Svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <Path fill="#fff3f3" d="M 000 150 s 0 200 150 200 s 250 -300 500 -100 s 500 -450 400 -650 s 100 550 100 550" transform="translate(-100, -250), scale(1.,1)" />
      </Svg> */}
      </View>
      {getTextEmptyQuestion()}
    <ScrollView style={{marginBottom:"0%" }} showsVerticalScrollIndicator={false}>
      <SwipeProvider>
        <View style={{ height: 65, marginTop:20}} />
          <TouchableOpacity onPress={replyAllQuestions} style={{ flexDirection: "row", textAlign: 'center', justifyContent: 'center' }}>
            {!allQuestionsAnswered && <SimpleLineIcons name="loop" size={20} color={"#555"}></SimpleLineIcons>}
            <Text style={{ fontSize: 16, color: "#000", textAlign: 'center', justifyContent: 'center', fontFamily: 'Montserrat-Regular' }}>
              {!allQuestionsAnswered ? " answer all" : ""}
            </Text>
          </TouchableOpacity>
          <View style={{ height: 15 }} />
          <View style={{ flex: 1}}>
            {listItems}
          </View>
        <View style={{height:70}}/>
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