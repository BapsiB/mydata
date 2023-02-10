import { Text, StyleSheet, TouchableOpacity, Image, View, Animated } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { SwipeItem, SwipeButtonsContainer } from 'react-native-swipe-item';
import DataManager from './dataManager.js';
import SharedConstants from './sharedConstants.js';
import LinearGradient from 'react-native-linear-gradient';
import HeaderDate from './headerDate';
import Utils from './utils'
import { Data } from 'victory-core';

export default QuestionButton = (props) => {

    const itemRef = useRef(true);
    const valueAnim = useRef(new Animated.Value(0)).current;
    
    const [answerText, setAnswerText] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [answerNorm, setAnswerNorm] = useState(0);
    const [question, setQuestion] = useState(null);

    useEffect(() => {
      HeaderDate.addChangeCallback("QuestionButton" + props.questionID, dateChange);
      setQuestion(DataManager.getQuestionWithId(props.questionId))
      dateChange();
    })

    function dateChange() {

      const date = HeaderDate.getDate();
      if(date !== undefined) {
        const answer = DataManager.getAnswerForQuestion(props.questionId, date);
        const lIsAnswered = (answer != null) && (answer !== undefined);
        setIsAnswered(lIsAnswered);
        
        if(lIsAnswered) {
          const question = DataManager.getQuestionWithId(props.questionId);
          const lAnswerNorm = question.normalizeValue(answer);
          setAnswerNorm(lAnswerNorm);
          // Will change fadeAnim value to 1 in 5 seconds
          Animated.timing(valueAnim, {
            toValue: lAnswerNorm,
            duration: 300,
            useNativeDriver: true,
          }).start();
          setAnswerText(SharedConstants.getAnswerText(answer, DataManager.getQuestionWithId(props.questionId)));
        }
        else {
          setAnswerNorm(0);
          // Will change fadeAnim value to 1 in 5 seconds
          Animated.timing(valueAnim, {
            toValue: -1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }
    }

    // Next, interpolate beginning and end values (in this case 0 and 1)
    const animInterpol = valueAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ["0deg", "75deg", "195deg"]
    })


  const openQuestionVisu = () => {
    props.navigation.navigate(question.id + "vizz")
  }

  const goToQuestion = () => {
    props.navigation.navigate("Answer Screen", props.questionId);
  }

  const requestDelete = () => {
    if(DataManager.deleteQuestion(props.questionId)) {
        props.changeCallback();
        itemRef.current.close();
    }   
  }

  const requestEdit = () => {
    props.editCallback(props.questionId);
    itemRef.current.close();
  }

function getTextAnswer() {
  if(!isAnswered) {
    return "?"
  }
  else if(question.type === SharedConstants.questionTypes.QUESTION_TYPE_YES_NO) {
    if(answerNorm > 0.5) {
      return "y";
    }
    else {
      return "n"
    }
  }
  return "";
}

  const styleAns = isAnswered ? styles.alreadyAnswered : styles.notAlreadyAnswered;

  const leftButton = (
    <SwipeButtonsContainer
        style={{
            textAlign:"center",
            flexDirection: 'column',
            backgroundColor:"#f66",
            height:50,
            width:60,
            paddingLeft:5,
            paddingTop:2,
            borderRadius: 9,
            borderColor: 'black',
            borderWidth:0
        }}
    >
        <TouchableOpacity
            onPress={() => {requestDelete();}}
        >
            <Image style={{ width:46, height:46,  resizeMode: 'stretch' }} source={require("../resources/delete.png")}/>
        </TouchableOpacity>
    </SwipeButtonsContainer>
);

const rightButton = (
    <SwipeButtonsContainer
        style={{
            textAlign:"center",
            flexDirection: 'column',
            height:50,
            width:60,
            paddingLeft:6,
        }}
    >
        <TouchableOpacity
            onPress={() => {requestEdit();}}
            style={{              borderRadius: 9,
                                  borderColor: 'black',
                                  borderWidth:0,
                                  height:50,
                                  backgroundColor:"#bfb",
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  }}
        >
            <Image style={{ width:40, height:40,  resizeMode: 'stretch' }} source={require("../resources/pencil.png")}/>
        </TouchableOpacity>
    </SwipeButtonsContainer>
);

  return (
  <View style={{marginVertical:0}}>
  <SwipeItem
      style={styles.questionsButtons}
      swipeContainerStyle={[styles.swipeContentContainerStyle, styleAns]}
      leftButtons={leftButton}
      rightButtons={rightButton}
      ref={itemRef} 
      onPress={()=>{goToQuestion();}}
  >
  <TouchableOpacity style={{height:"100%", textAlign: 'center', justifyContent: 'center',}} onPress={()=>{openQuestionVisu();}}>
        <Text style={{fontSize: 16, color:"#555", textAlign: 'center', justifyContent: 'center'}}>
            {props.title}
        </Text>
        <View style={[styles.shadowView]}>
        
        <TouchableOpacity style={[]} onPress={()=>{goToQuestion();}}>

        {isAnswered && <View style={{position:"absolute", width:"100%", height:"100%", textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <View style={[styles.line, {transform: [{rotateZ:"30deg"}, {translateX:-20}]}]}></View>
          <View style={[styles.line, {transform: [{rotateZ:"90deg"}, {translateX:-20}]}]}></View>
          <View style={[styles.line, {transform: [{rotateZ:"150deg"}, {translateX:-20}]}]}></View>
        </View>}
        <Animated.View style={[styles.animatedContainerAnswered, {transform: [{rotateZ:animInterpol}, {scale:0.8}]}, isAnswered ? Utils.getShadowStyle() : null]}>
          <LinearGradient
              start={{x: 0.5, y: 1}} end={{x: 0.5, y: 0}}
              locations={[0, 1, 1]}
              colors={[ "white", "white", "#fff"]}
              style={[styles.answerContainer]}>
          </LinearGradient>
        </Animated.View>
        <View style={{position:"absolute", width:"100%", height:"100%", textAlign: 'center', justifyContent: 'center', elevation:15}}>
          <Text style={{width:"100%", textAlign: 'center', justifyContent: 'center', fontWeight:"bold", color: "#999"}}>
                {getTextAnswer()}
          </Text>
        </View>

      </TouchableOpacity>
      </View>
  </TouchableOpacity>
  </SwipeItem>
  </View>
  );
}

const styles = StyleSheet.create({
  questionsButtons: {
    marginVertical:3,
    marginHorizontal:20,
    paddingHorizontal:3,
    borderWidth:0,
    borderRadius:10,
    height:50,
    flex:1,
    borderColor:"black",
    justifyContent: 'center',
    alignItems: 'center',
  },

  line:{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width:4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  answerContainer: {
    fontSize: 16,
    color:"grey",
    textAlign:"right",
    width:30,
    height:30,
    paddingRight:0,

    justifyContent: 'center',
    textAlign:"center",
    backgroundColor:"white",

  },

  animatedContainer: {
    width:30,
    borderRadius:15,
    borderWidth:0,
    borderColor:"#333",
    overflow: 'hidden',
    backgroundColor:"white",
  },

  animatedContainerAnswered: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderColor:"#bbb",
    borderWidth:1,
    overflow: 'hidden',
  },

  shadowView: {
    right:5,
    width:30,
    position:"absolute",
    right:5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 0,
  },

  swipeContentContainerStyle: {
      justifyContent: 'center',
      borderRadius: 9,
      borderColor: 'black',
      borderWidth:0,
  },

    notAlreadyAnswered: {
      shadowColor: "#fff",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 3,
      backgroundColor: '#f7f7f7',
    },

    alreadyAnswered: {
      backgroundColor: '#f7f7f7',
    }
});