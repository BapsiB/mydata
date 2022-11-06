import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import AnswerYesNo from './answerComponents/answerYesNo.js';
import AnswerSlider from './answerComponents/answerSlider.js';
import HeaderDate from './headerDate.js';

const AnswerScreen = (props) => {

const [modalVisible, setModalVisible] = useState(false);

const lCurrentQuestion = DataManager.getQuestionWithId(props.route.params);
const [currentQuestion, setCurrentQuestion] = React.useState(lCurrentQuestion);

//  const [currentDate, setCurrentDate] = React.useState(date);
  const lView = getViewForQuestionId(currentQuestion);

   function getViewForQuestionId(aCurrentQuestion, date) {
        switch(aCurrentQuestion.type) {
            case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
                return <AnswerYesNo date={HeaderDate.getDate()} question={aCurrentQuestion} callback={nextQuestion}/>;
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
                return <AnswerSlider date={HeaderDate.getDate()} callback={nextQuestion} question={aCurrentQuestion}/>
            break;
            case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
                return <AnswerSlider date={HeaderDate.getDate()} callback={nextQuestion} question={aCurrentQuestion}/>
            break;
        }
   }

   function nextQuestion(goNext, onlyTakeEmptyAnswer) {
    if(goNext === undefined) {
        goNext = true;
    }

    // undefined means it comes from the answer slider.
    if(onlyTakeEmptyAnswer === undefined) {
        onlyTakeEmptyAnswer = true;
    }
    const nextQuestion = DataManager.getNextQuestion(currentQuestion.id, true, onlyTakeEmptyAnswer, HeaderDate.getDate());
    if(nextQuestion == null) {
        setModalVisible(true);
        return;
    }
    setCurrentQuestion(nextQuestion);
   }

   function onReturn() {
        props.navigation.navigate("Home");
   }

  return (
    <View style={{ flex: 1}}>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    <View style={{ flex: 1}}>
        {HeaderDate.getHeader()}
        <View style={{ flex: 1}}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>
        <View style={{ flex: 1}}>
            {lView}
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: "row"}}>
        <TouchableOpacity style={[SharedConstants.styles.BaseButtons, { flex: 1}]} onPress={()=>{nextQuestion(false, false);}}>
            <Text style={{color:"black"}}>PREV</Text>
        </TouchableOpacity>       
         <TouchableOpacity style={[SharedConstants.styles.BaseButtons, { flex: 2}]} onPress={()=>{onReturn();}}>
            <Text style={{color:"black"}}>RETURN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[SharedConstants.styles.BaseButtons, { flex: 1}]} onPress={()=>{nextQuestion(true);}}>
            <Text style={{color:"black"}}>NEXT</Text>
        </TouchableOpacity>
        </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    questionText: {
        marginVertical:50,
        marginHorizontal:20,
        color: 'black',
        fontSize: 35,
        fontWeight: '500',
        textAlignVertical:'center',
        textAlign:'center',
    },

 });

export default AnswerScreen;