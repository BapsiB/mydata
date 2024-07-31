import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, Animated } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { SwipeItem, SwipeButtonsContainer } from 'react-native-swipe-item';
import DataManager from './dataManager';
import SharedConstants from './sharedConstants.js';
import LinearGradient from 'react-native-linear-gradient';
import HeaderDate from './headerDate';
import Utils from './utils'
import utils from './utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import QuestionButtonViz from './dataVizzScreen/questionButtonViz';
import Svg, { Path } from 'react-native-svg';

const colourCircleAnswered = "#fff";
const colourCircleNOTAnswered = "#fff";
const colourTextCircleNOTAnswered = "#aaa";
const colourTextCircleAnswered = "#444";
const colourText = '#555';
const colourTextAnswered = '#333';
// const colourButtonBack = '#fff3f3';
const colourButtonBack = '#f7f7f7';
let colourButtonBackAnswered = '#fff';

export default QuestionButton = ({title, navigation, questionId, changeCallback, editCallback, isEditMode, onDragStart, isBeingDragged}) => {

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
      HeaderDate.addChangeCallback("QuestionButton" + questionId, dateChange);
      const lQuestion = DataManager.getQuestionWithId(questionId);
      setQuestion(lQuestion);
      dateChange();
    })

    function dateChange() {
      
      const date = HeaderDate.getDate();
      if(date !== undefined) {
        const answer = DataManager.getAnswerForQuestion(questionId, date);
        const lIsAnswered = (answer != null) && (answer !== undefined);
        setIsAnswered(lIsAnswered);
        
        if(lIsAnswered) {
          const question = DataManager.getQuestionWithId(questionId);
          let lAnswerNorm = question.normalizeValue(answer);
          setAnswerNorm(lAnswerNorm);

          if(question.type == SharedConstants.questionTypes.QUESTION_TYPE_COLOUR) {
            setColourMarker(Utils.increase_brightness(answer, 20));
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
          setAnswerText(SharedConstants.getAnswerText(answer, DataManager.getQuestionWithId(questionId)));
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
    navigation.navigate(question.id + "vizz")
  }

  const goToQuestion = () => {
    if (isEditMode) {
      requestEdit();
    }
    else {
        navigation.navigate("Answer Screen", { id: questionId, onlyTakeUnanswered: false, automaticNextQuestion:false });
    }
    
  }

  const requestDelete = () => {
    if(DataManager.deleteQuestion(questionId)) {
        changeCallback();
    }   
  }

  const requestEdit = () => {
    editCallback(questionId);
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
      return (<Text style={{ textAlign: 'left', fontWeight:"bold", fontSize: 12, color: colourTextCircleNOTAnswered, marginBottom: 0 }}>
        
      </Text >);
    }

    switch (question.type) {
      case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
      case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
      case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
        return (<Text style={{ width: "100%", textAlign: 'left', fontFamily: 'Montserrat-SemiBold', justifyContent: 'center', fontSize: 13, textAlignVertical: 'center', color: isAnswered ? colourTextCircleAnswered : colourTextCircleNOTAnswered}}>
          {getTextAnswer()}
        </Text >);
      case SharedConstants.questionTypes.QUESTION_TYPE_COLOUR:
        return (
          <View style={{ width: 40, height: 20, backgroundColor: colourMarker, borderRadius: 50 }}></View>
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

  return (
  <View style={{marginVertical:0, flexBasis: '50%', height:110}}>

      <View style={[styles.questionsButtons, styles.swipeContentContainerStyle, styleAns, { width: "90%", marginLeft: "5%" }, isEditMode && styles.editModeContainer,]}>
        <TouchableOpacity
          style={[
            styles.container,
            isBeingDragged && styles.draggingContainer,
          ]}

          onPress={() => { goToQuestion(); }}
          onLongPress={isEditMode ? onDragStart : null}

        >

          <View style={[{ marginLeft: 20, width: "70%", height: "100%", flexDirection: "column", flex: 1, flexWrap: 'wrap' },
            
          ]}>
            <Text style={{fontSize: 13, color:isAnswered ? colourTextAnswered : colourText, textAlign: 'left', justifyContent: 'center', textAlignVertical: 'center', fontFamily: 'Montserrat-Regular', backgroundColor:"transparent", flex:3}}>
            {title}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: 'wrap', height: 40, alignItems:"center"}}>
              {!isEditMode && (<View style={isAnswered ? styles.circleAnswered : styles.circleNotAnswered}></View>)}
              {!isEditMode && (<View style={{ width: 200, marginLeft: 5 }}>
                {getRightResultView()}
              </View>)}
            </View>
          </View>
          {isEditMode && (
            <View style={styles.dragHandleContainer}>
              <SimpleLineIcons name="menu" size={20} color="#bbb" style={styles.dragHandle} />
            </View>
          )}
          <View style={{height:"100%", justifyContent:"center"}}>
            {question && !isEditMode && <QuestionButtonViz style={{ height: 0, flex: 2, backgroundColor: "transparent" }} questionId={question.id}></QuestionButtonViz>}
          </View>
        </TouchableOpacity>
        </View>
        </View>
  );
}

const QuestionButtonEdit = ({title}) => {

  const editQuestion = () => {
    editCallback(questionId);
  }
  
  return (
    <View style={[{marginVertical:0, height:50, flexDirection:"row"}, styles.questionsButtonsEdit, styles.alreadyAnswered]}>
      {/* <IconCommunity name="drag-vertical" size={40} color="#777" style={{width:30, height:40, position:"absolute", left:-5}}/> */}
      <TouchableOpacity style={[{height:50, marginLeft:"15%", width:"70%", flexDirection:"row"}, {alignItems: 'center', justifyContent: 'center'}]} onPress={()=>{editQuestion();}}>
        <Text style={{fontSize: 16, color:colourTextAnswered, textAlign: 'center', justifyContent: 'center', fontFamily: 'Montserrat-SemiBold'}}>
            {title}
        </Text>
    </TouchableOpacity>
  </View>
  )
};

export {QuestionButtonEdit}

const styles = StyleSheet.create({
  questionsButtons: {
    marginVertical:10,
    marginLeft:20,
    marginRight:10,
    paddingHorizontal:3,
    borderWidth:0,
    borderRadius:35,
    height:50,
    flex:1,
    borderColor:"black",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation:6
  },

  container: {
    height: "100%",
    width: "100%",
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    flex: 1,
    flexWrap: 'wrap'
  },

    questionsButtonsEdit: {
    marginVertical:10,
    marginLeft:20,
    marginRight:10,
    paddingHorizontal:3,
    borderWidth:1,
    borderRadius:5,
    height:50,
    flex:1,
    borderColor:"black",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation:2
  },

  circleAnswered: {
    backgroundColor: "#afa",
    width: 11,
    height: 11,
    borderRadius: 7
  },

  circleNotAnswered: {
    borderWidth: 1,
    borderColor:"#999",
    width: 11,
    height: 11,
    borderRadius: 7
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

  swipeContentContainerStyle: {
      justifyContent: 'center',
      borderRadius:25,
      borderColor: 'black',
      borderWidth:0,
  },

    notAlreadyAnswered: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      // shadowRadius: 3.84,
  
      elevation: 8,
      backgroundColor: colourButtonBack,
  },
    
  draggingContainer: {
    opacity: 0.7,
    transform: [{ scale: 1.05 }],
  },

    editModeContainer: {
      backgroundColor: '#fffbfc',
  },

  dragHandleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    alignSelf: 'stretch',
  },
    
  dragHandle: {
    marginRight: 10,
  },

    alreadyAnswered: {
      borderWidth:1,
      borderColor:"#fff",
      backgroundColor: colourButtonBackAnswered,
    }
});