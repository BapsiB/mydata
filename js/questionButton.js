import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, Animated } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { SwipeItem, SwipeButtonsContainer } from 'react-native-swipe-item';
import DataManager from './dataManager.js';
import SharedConstants from './sharedConstants.js';
import LinearGradient from 'react-native-linear-gradient';
import HeaderDate from './headerDate';
import Utils from './utils'
import { Data } from 'victory-core';
import utils from './utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Svg, { Path } from 'react-native-svg';

// const colourAnswered = "#DECCF1";
// const colourButtonBack = '#FDD7C2';
// const colourText = '#666';

const colourCircleAnswered = "#fff";
const colourCircleNOTAnswered = "#fff";
const colourTextCircleNOTAnswered = "#aaa";
const colourTextCircleAnswered = "#444";
const colourText = '#555';
const colourTextAnswered = '#333';
// const colourButtonBack = '#fff3f3';
const colourButtonBack = '#fff';
let colourButtonBackAnswered = '#fff9f9';

export default QuestionButton = (props) => {



    const itemRef = useRef(true);
    const valueAnim = useRef(new Animated.Value(0)).current;
    
    const [answerText, setAnswerText] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [answerNorm, setAnswerNorm] = useState(0);
    const [colourMarker, setColourMarker] = useState("#fff");
    const [question, setQuestion] = useState(null);

    if(question) {
      colourButtonBackAnswered = '#a3f3f3';//utils.increase_brightness(question.color, 70);
    }

    useEffect(() => {
      HeaderDate.addChangeCallback("QuestionButton" + props.questionID, dateChange);
      setQuestion(DataManager.getQuestionWithId(props.questionId));
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
          let lAnswerNorm = question.normalizeValue(answer);
          setAnswerNorm(lAnswerNorm);

          if(question.type == SharedConstants.questionTypes.QUESTION_TYPE_COLOUR) {
            setColourMarker(Utils.increase_brightness(answer, 80));
          }
          else {
            setColourMarker(colourCircleAnswered);
          }

          if(question.type == SharedConstants.questionTypes.QUESTION_TYPE_YES_NO) {
            lAnswerNorm = (lAnswerNorm == 1) ? 0.5 : -2;
          }

          // Will change fadeAnim value to 1 in 5 seconds
          Animated.timing(valueAnim, {
            toValue: lAnswerNorm,
            duration: 400,
            useNativeDriver: true,
          }).start();
          setAnswerText(SharedConstants.getAnswerText(answer, DataManager.getQuestionWithId(props.questionId)));
        }
        else {
          setColourMarker(colourCircleNOTAnswered);
          setAnswerNorm(0);
          // Will change fadeAnim value to 1 in 5 seconds
          Animated.timing(valueAnim, {
            toValue: -1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }
      }
    }

    // Next, interpolate beginning and end values (in this case 0 and 1)
    const animInterpol = valueAnim.interpolate({
      inputRange: [-2, -1, 0, 1],
      outputRange: ["-45deg", "0deg", "80deg", "200deg"]
    })


  const openQuestionVisu = () => {
    props.navigation.navigate(question.id + "vizz")
  }

  const goToQuestion = () => {
    props.navigation.navigate("Answer Screen", { id: props.questionId, onlyTakeUnanswered: true });
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
      return "yes";
    }
    else {
      return "no"
    }
  }
  else if(question.type === SharedConstants.questionTypes.QUESTION_TYPE_NUMBER)
  {
    return answerText;
  }
  else if(question.type === SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY)
  {
    return answerText;
  }
}

function displayMarkers() {
  if(!isAnswered) {
    return false;
  }
  else{
    return (question.type == SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY) || (question.type == SharedConstants.questionTypes.QUESTION_TYPE_NUMBER);
  } 
}
  
  const CamembertSlice = ({ percentage, radius, color }) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  // Move to center of circle
  const moveTo = `M ${radius} ${radius} `;
  // Line to the top of the circle
  const lineTo = `L ${radius} 0 `;
  // Arc around the circle
  const arc = `A ${radius} ${radius} 0 ${percentage > 50 ? '1' : '0'} 1 ${radius + Math.sin(2 * Math.PI * percentage / 100) * radius} ${radius - Math.cos(2 * Math.PI * percentage / 100) * radius} `;
  // Close the path
  const close = 'Z';

  return (
    
    <Svg width={radius * 2} height={radius * 2}>
      <Path
        d={`${moveTo}${lineTo}${arc}${close}`}
        fill={color}
      />
    </Svg>
  );
};
  
  function getRightResultView() {
    if (!isAnswered) {
      return (<Text style={{ width: "100%", textAlign: 'center', fontWeight:"bold", justifyContent: 'center', fontSize: 12, color: isAnswered ? colourTextCircleAnswered : colourTextCircleNOTAnswered, marginBottom: 0 }}>
        {"?"}
      </Text >);
    }

    switch (question.type) {
      case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
      case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
        return (< Text style={{ width: "100%", textAlign: 'center', justifyContent: 'center', fontSize: 12, fontWeight: "regular", color: isAnswered ? colourTextCircleAnswered : colourTextCircleNOTAnswered, marginBottom: 0 }}>
          {getTextAnswer()}
        </Text >);

      case SharedConstants.questionTypes.QUESTION_TYPE_COLOUR:
        return (
          <View style={{ width: 20, height: 20, backgroundColor: colourMarker, borderRadius: 50 }}></View>
        )
      case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
        const styleFull = { backgroundColor: "#999" };
        const styleEmpty = { borderColor:"#ddd", borderWidth:1 };
        const lNormValue = answerNorm;
        return (
          <View>
            <View style={{ position: 'absolute', top: -15, left: -15, justifyContent: 'center' }} >
              <CamembertSlice style={{ justifyContent: 'center' }} percentage={99} radius={10} color={"#eadada"}></CamembertSlice>
            </View>
            <View style={{ position: 'absolute', top: -15, left: -15, justifyContent: 'center' }}>
              <CamembertSlice  percentage={answerNorm * 100} radius={10} color={"#fff"}></CamembertSlice>
            </View>
          </View>
        )
    }
  }

// {backgroundColor:utils.increase_brightness(question.colour, 90)}
  const styleAns = isAnswered ? [styles.alreadyAnswered] : styles.notAlreadyAnswered;

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
  <View style={{marginVertical:0, flexBasis: '50%', height:70}}>
  {/* <SwipeItem
      style={styles.questionsButtons}
      swipeContainerStyle={[styles.swipeContentContainerStyle, styleAns]}
      leftButtons={leftButton}
      rightButtons={rightButton}
      ref={itemRef} 
      onPress={()=>{goToQuestion();}}
  > */}
      <View style={[styles.questionsButtons, styles.swipeContentContainerStyle, styleAns, { width: "90%", marginLeft: "5%" }]}>
        {/* <TouchableOpacity style={{ width: "10%", height: "100%", position: "absolute", left: 0, zIndex:1, textAlign: 'center', justifyContent: 'center', borderWidth: 0 }} onPress={() => { openQuestionVisu(); }}>
          <IconCommunity name="eye-outline" size={20} color="#bbb" style={{ width: 30, height: 20, position: "absolute", left: 5 }} />
        </TouchableOpacity> */}
        <TouchableOpacity style={{ left:"0%", height: "100%", width: "100%", textAlign: 'center', justifyContent: 'center'}} onPress={() => { goToQuestion(); }}>
        <Text style={{fontSize: 14, marginLeft:10, width:"50%", color:isAnswered ? colourTextAnswered : colourText, textAlign: 'left', justifyContent: 'center', fontFamily: 'Montserrat-SemiBold'}}>
            {props.title}
        </Text>
        <View style={[styles.shadowView]}>
        <TouchableOpacity style={[{width: 50, height:50}]} onPress={()=>{goToQuestion();}}>

        {/* {(displayMarkers()) && <View style={{position:"absolute", width:"100%", height:"100%", textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <View style={[styles.line, {transform: [{rotateZ:"30deg"}, {translateX:-20}]}]}></View>
          <View style={[styles.line, {transform: [{rotateZ:"90deg"}, {translateX:-20}]}]}></View>
          <View style={[styles.line, {transform: [{rotateZ:"150deg"}, {translateX:-20}]}]}></View>
        </View>} */}
        {!isAnswered && <Animated.View style={[styles.animatedContainerAnswered, {transform: [{rotateZ:animInterpol}, {scale:0.7}]}, isAnswered ? {borderColor:"#777"} : null]}>
          <LinearGradient
              start={{x: 0.5, y: 1}} end={{x: 0.5, y: 0}}
              locations={[0, 1, 1]}
              colors={[ colourMarker, colourMarker, "#fff"]}
              style={[styles.answerContainer]}>
          </LinearGradient>
        </Animated.View>}
        
        <View style={{position:"absolute", width:"100%", height:"100%", textAlign: 'center', justifyContent: 'center', elevation:15, flexDirection: 'row', alignItems: 'center'}}>
          {getRightResultView()}   
        </View>

      </TouchableOpacity>
      </View>
  </TouchableOpacity>
  </View>
  {/* </SwipeItem> */}
  </View>
  );
}

const QuestionButtonEdit = (props) => {

  const editQuestion = () => {
    props.editCallback(props.questionId);
  }
  
  return (
    <View style={[{marginVertical:0, height:50, flexDirection:"row"}, styles.questionsButtons, styles.alreadyAnswered]}>
      <IconCommunity name="drag-vertical" size={40} color="#777" style={{width:30, height:40, position:"absolute", left:-5}}/>
      <TouchableOpacity style={[{height:50, marginLeft:"15%", width:"85%", flexDirection:"row"}, {alignItems: 'center', justifyContent: 'center'}]} onPress={()=>{editQuestion();}}>
        <Text style={{fontSize: 16, color:colourTextAnswered, textAlign: 'center', justifyContent: 'center'}}>
            {props.title}
        </Text>
        <View style={[styles.shadowView, {width:30, right:0, textAlign: 'right', position:'absolute'}]}>
          <Icon name="edit" size={20} color="#444"  style={{width:20, height:20}}/>
        </View>
    </TouchableOpacity>
  </View>
  )
};

export {QuestionButtonEdit}

const styles = StyleSheet.create({
  questionsButtons: {
    marginVertical:4,
    marginLeft:20,
    marginRight:10,
    paddingHorizontal:3,
    borderWidth:0,
    borderRadius:15,
    height:50,
    flex:1,
    borderColor:"black",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation:0
  },

  line:{
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    width:2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  answerContainer: {
    fontSize: 16,
    color:"grey",
    textAlign:"right",
    width:30,
    height:30,
    paddingBottom:2,

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
    borderBottomLeftRadius: 15,
    width:30,
    marginLeft:10,
    marginTop:10,
    borderColor:"#999",
    borderWidth:1,
    overflow: 'hidden',
  },

  shadowView: {
    width:30,
    position:"absolute",
    right:20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 0,
  },

  swipeContentContainerStyle: {
      justifyContent: 'center',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderColor: 'black',
      borderWidth:0,
  },

    notAlreadyAnswered: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 0,
      backgroundColor: colourButtonBack,
    },

    alreadyAnswered: {
      borderWidth:1,
      borderColor:"#cdc",
      backgroundColor: colourButtonBackAnswered,
    }
});