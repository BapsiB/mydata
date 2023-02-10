import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import SharedConstants from './sharedConstants.js';
import DataManager from './dataManager.js';
import AnswerYesNo from './answerComponents/answerYesNo.js';
import AnswerSlider from './answerComponents/answerSlider.js';
import AnswerNote from './answerComponents/answerNote.js';
import AnswerColour from './answerComponents/answerColour';
import HeaderDate from './headerDate.js';
import Utils from './utils.js'
import {
  createStackNavigator
} from '@react-navigation/stack';

const AnswerScreen = (props) => {

    const [modalVisible, setModalVisible] = useState(false);

    const lCurrentQuestion = DataManager.getQuestionWithId(props.route.params);
    const [currentQuestion, setCurrentQuestion] = React.useState(lCurrentQuestion);

    const StackIn = createStackNavigator();

    const AnswerComponent = (props) => {
      const hasNextPrevButton = props.route.params.haveNextPrevButton ===  undefined ? true : props.route.params.haveNextPrevButton;
      const [localQuestion, setLocalQuestion] = React.useState(DataManager.getQuestionWithId(props.route.params.questionId));

      return (
        <View style={{ flex: 1}}>
        <View style={{ flex: 4}}>
          <View style={{ flex: 1}}>
            <Text style={styles.questionText}
                adjustsFontSizeToFit={true}
                numberOfLines={2}
            >{localQuestion.text}</Text>
          </View>
          <View style={{ flex: 3}}>
            {getProperAnswerElement(localQuestion)}
          </View>
        </View>
          <View style={{justifyContent: 'flex-end', alignItems: 'center', flexDirection: "row", backgroundColour:"blue", marginVertical:10}}>
        {hasNextPrevButton &&
          <TouchableOpacity style={[SharedConstants.styles.BaseButtons, { flex: 1}]} onPress={()=>{nextQuestion(false, false);}}>
              <Text style={{color:"black"}}>PREV</Text>
          </TouchableOpacity>      
        } 
          <TouchableOpacity style={[SharedConstants.styles.BaseButtons, { flex: 2}]} onPress={()=>{onReturn(hasNextPrevButton);}}>
              <Text style={{color:"black"}}>BACK</Text>
          </TouchableOpacity>
        {hasNextPrevButton &&
          <TouchableOpacity style={[SharedConstants.styles.BaseButtons, { flex: 1}]} onPress={()=>{nextQuestion(true, false);}}>
              <Text style={{color:"black"}}>NEXT</Text>
          </TouchableOpacity>
        }
        </View>
        </View>
      )
    }

    function nextQuestion(goNext, onlyTakeEmptyAnswer) {

      if(goNext === undefined) {
        return;
      }
  
      // undefined means it comes from the answer slider.
      if(onlyTakeEmptyAnswer === undefined) {
          onlyTakeEmptyAnswer = false;
      }
      const nextQuestionToDisplay = DataManager.getNextQuestion(currentQuestion.id, goNext, onlyTakeEmptyAnswer, true, HeaderDate.getDate());
      if(nextQuestionToDisplay == null) {
          setModalVisible(true);
          return;
      }
      setCurrentQuestion(nextQuestionToDisplay);
      if(goNext) {
        props.navigation.navigate(nextQuestionToDisplay.id, {questionIDNot:nextQuestionToDisplay.id}) ;
      }
      else {
        props.navigation.navigate(nextQuestionToDisplay.id + "-back", {questionIDNot:nextQuestionToDisplay.id})
      }
      
     }

    function getProperAnswerElement(aCurrentQuestion) {

      switch(aCurrentQuestion.type) {
          case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
              return (<AnswerYesNo date={HeaderDate.getDate()} question={aCurrentQuestion} callback={nextQuestion} key={aCurrentQuestion.id}/>);
          break;
          case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
              return (<AnswerSlider date={HeaderDate.getDate()} callback={nextQuestion} question={aCurrentQuestion} key={aCurrentQuestion.id}/>)
          break;
          case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
              return (<AnswerSlider date={HeaderDate.getDate()} callback={nextQuestion} question={aCurrentQuestion} key={aCurrentQuestion.id}/>)
          break;
          case SharedConstants.questionTypes.QUESTION_TYPE_COLOUR:
            return (<AnswerColour date={HeaderDate.getDate()} callback={nextQuestion} question={aCurrentQuestion} key={aCurrentQuestion.id}/>)
        break;
          case SharedConstants.questionTypes.QUESTION_TYPE_NOTE:
            return (<AnswerNote date={HeaderDate.getDate()} callback={nextQuestion} navigation={props.navigation} question={aCurrentQuestion} key={aCurrentQuestion.id}/>)
          break;
      }
    }

  function getStackNavigator() {
    // in case it's a note, we are in a different system. there will be no next and prev buttons.
    if(lCurrentQuestion.type == SharedConstants.questionTypes.QUESTION_TYPE_NOTE) {
      let options = {headerShown:false};
      return <StackIn.Screen name={lCurrentQuestion.id} component={AnswerComponent} options={options} key={lCurrentQuestion.id } initialParams={{ questionId: lCurrentQuestion.id, haveNextPrevButton:false }} />
    }

    listQuestions = DataManager.getQuestions();
    let optionsForth = Utils.horizontalScreenAnimation;
    optionsForth.headerShown = false;
    let optionsBack = Utils.horizontalScreenAnimationRightToLeft;
    optionsBack.headerShown = false;
    const listItemsforth = listQuestions.map((d) => 
      <StackIn.Screen name={d.id} component={AnswerComponent} options={optionsForth} key={d.id} initialParams={{ questionId: d.id }} />
      );
    // basically because i didn't find a better way, we put twice the screens with different animation.
    const listItemsback = listQuestions.map((d) => <StackIn.Screen name={d.id + "-back"} component={AnswerComponent} options={optionsBack} key={d.id + "-back"} initialParams={{ questionId: d.id }} />);
    return listItemsforth.concat(listItemsback);
  }

   const forceUpdate = React.useReducer(() => ({}))[1]

   function dateChanged() {
    forceUpdate();
   }

   HeaderDate.addChangeCallback("AnswerScreen",dateChanged);

   function onReturn(goHome) {    
    if(goHome)
      props.navigation.navigate("Home");
    else 
      props.navigation.navigate("Home", { screen: 'Notes' });
   }

  return (
    <View style={{ flex: 1}}>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>You went through all the questions.</Text>
            <View style={{flexDirection: "row"}}>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
                >
                <Text style={styles.textStyle}>CONTINUE</Text>
                </Pressable>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => onReturn(true)}
                >
                <Text style={styles.textStyle}>HOME</Text>
                </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    <View style={{ flex: 1}}>
        {HeaderDate.getHeader()}
        <View style={{ flex: 1}}>
        <StackIn.Navigator initialRouteName={currentQuestion.id}>
          {getStackNavigator()}
        </StackIn.Navigator>
        </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    questionText: {
        marginVertical:0,
        marginHorizontal:20,
        color: 'black',
        fontSize: 25,
        fontWeight: '500',
        textAlignVertical:'center',
        textAlign:'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginHorizontal:5
      },
      buttonOpen: {
        backgroundColor: "#Fbc4FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        color:"black"
      }
    

 });

export default AnswerScreen;