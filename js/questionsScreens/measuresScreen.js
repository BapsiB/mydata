import React, { useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';
import QuestionButton from '../questionButton'
import { SwipeProvider } from 'react-native-swipe-item';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const MeasuresScreen = ({navigation, date}) => {

  useEffect(() => {
    DataManager.addQuestionsListener("MeasuresScreen", updateQuestions);
  }, []);

  const allQuestionsAnswered = DataManager.getNextQuestionUnrespondedInArray(0, HeaderDate.getDate()) ? false : true;

  const updateQuestions = () => {
    const arrayQuestionsOrigin = DataManager.getQuestions();
    // we remove the questions that are the notes (they will be displayed in another screen)
    const filtered = arrayQuestionsOrigin.filter((question) => { return question.type != SharedConstants.questionTypes.QUESTION_TYPE_NOTE });
    const filteredNotes = DataManager.getNotes();
    setArraNotes(filteredNotes);
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
    navigation.navigate("Answer Screen", { id: question.id, onlyTakeUnanswered:true, automaticNextQuestion:true} );
  }

  function addQuestion() {
    navigation.navigate("Question Editor", { startType: SharedConstants.questionTypes.QUESTION_TYPE_YES_NO });
  }

  function editNote(aId) {
    const question = DataManager.getNoteQuestion(aId);
    navigation.navigate("Answer Screen", { id: question.id, onlyTakeUnanswered:false, automaticNextQuestion:false} );
  }

  function getAnswerNote(aNoteId) {
    return DataManager.getAnswerForQuestion(aNoteId, HeaderDate.getDate());
  }

  DataManager.setAnswersUpdateListener(updateAnswer);
  HeaderDate.addChangeCallback("MeasureScreen", updateAnswer);

  const [arrayQuestions, setArrayQuestions] = React.useState([]);
  const [arrayNotes, setArraNotes] = React.useState([]);
  const listItems = arrayQuestions.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButton>);
  const listNotesItems = arrayNotes.map((d) => getNote(d.id));

  function getNote(id) {
    const note = DataManager.getQuestionWithId(id);
    if (!note) {
      return null;
    }
    return(         
        <TouchableOpacity
          onPress={() => { editNote(id) }}
          >
            <Text style={{marginLeft:"5%", marginTop:30, fontFamily: 'Montserrat-Regular', color:"#555"}}>{note.text + ":"}</Text>
            <View style={{ flex: 1, flexDirection: "row", width:"90%", marginLeft:"5%", marginTop:20, paddingLeft:10, paddingBottom:40, paddingTop:20, backgroundColor:"#fafafa", elevation:2, borderRadius:5 }}>
              <SimpleLineIcons color={"#555"} size={15} name="pencil" style={{ marginLeft: -15, marginTop: -5, marginRight: 10, width: 30, height: 30, transform: [{ rotateY: '180deg' }] }}></SimpleLineIcons>
              <Text style={[{ width: "90%", marginTop:"5%", left:"10%", position:"absolute", color: "#aaa" }]} multiline={true} numberOfLines={3}>{getAnswerNote(id)}</Text>
              <Text style={[{ width: "90%", marginTop:"5%", left:"10%", position:"absolute", textDecorationLine: 'underline', color: "#aaa" }]} multiline={true} numberOfLines={3}>{"                                                                               " + "\n" + "                                                                               " +  "\n" + "                                                                               "}</Text>
            </View>
      </TouchableOpacity>);
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Image style={{resizeMode: 'cover', width:"100%", height:"100%", position:"absolute"}} source={require("../../resources/background.jpg")}></Image>
      <View style={{position:"absolute", elevation:2, zIndex:2, width:"100%", height:60, backgroundColor:"white"}}>
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
          {/* <TouchableOpacity
            onPress={editNote}
          >
            <Text style={{marginLeft:"5%", marginTop:30, fontFamily: 'Montserrat-Regular'}}>{"Notes:"}</Text>
            <View style={{ flex: 1, flexDirection: "row", width:"90%", marginLeft:"5%", marginTop:20, paddingLeft:10, paddingBottom:40, paddingTop:20, backgroundColor:"#fafafa", elevation:2, borderRadius:5 }}>
              <SimpleLineIcons color={"#555"} size={15} name="pencil" style={{ marginLeft: -15, marginTop: -5, marginRight: 10, width: 30, height: 30, transform: [{ rotateY: '180deg' }] }}></SimpleLineIcons>
              <Text style={[{ width: "90%", marginTop:"5%", left:"10%", position:"absolute", color: "#aaa" }]} multiline={true} numberOfLines={3}>{getAnswerNote()}</Text>
              <Text style={[{ width: "90%", marginTop:"5%", left:"10%", position:"absolute", textDecorationLine: 'underline', color: "#aaa" }]} multiline={true} numberOfLines={3}>{"                                                                               " + "\n" + "                                                                               " +  "\n" + "                                                                               "}</Text>
            </View>
          </TouchableOpacity > */}
          {listNotesItems}
          <TouchableOpacity
            onPress={addQuestion}
            style={{ width: "100%", justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <View style={{width:50, height:50, borderRadius:25, borderWidth:1, borderColor:"#ddd", elevation:2, shadowColor: "#aaa", backgroundColor:"white", justifyContent: 'center'}}>
              <Text style={{ width: 50, color:"#555", textAlign: 'center', fontSize:30, fontFamily: 'Montserrat-Thin' }}>+</Text>
            </View>
          </TouchableOpacity>
        <View style={{height:30}}/>
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