import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';
import DataManager from './dataManager.js';
import SharedConstants from './sharedConstants.js';


export default QuestionButton = (props) => {
const goToQuestion = () => props.navigation.navigate("Answer Screen", props.questionId);

  const requestDelete = () => {
    if(DataManager.deleteQuestion(props.questionId)) {
        props.changeCallback();
    }   
  };

  const answer = DataManager.getAnswerForQuestion(props.questionId, props.date);
  const isAnswered = (answer != null) && (answer !== undefined);
  const styleAns = isAnswered ? styles.alreadyAnswered : styles.notAlreadyAnswered;
  let answerText = "";
  if(isAnswered) {
    answerText = getAnswerText(answer, DataManager.getQuestionWithId(props.questionId).type);
  }

  return (
  <SwipeItem
      style={styles.questionsButtons}
      swipeContainerStyle={[styles.swipeContentContainerStyle, styleAns]}
      leftButtons={leftButton}
      rightButtons={rightButton}
      onPress={()=>{goToQuestion;}}
  >
  <TouchableOpacity onPress={()=>{goToQuestion();}}>
        <Text style={{fontSize: 16, color:"black", textAlign: 'center'}}>
            {props.title}
        </Text>
      <Text style={{fontSize: 16, color:"grey", textAlign:"right", position:"absolute", width:'100%', paddingRight:10}}>
          {answerText}
      </Text>
  </TouchableOpacity>
  </SwipeItem>

  );



}

const getAnswerText = function(answerValue, questionType) {
    switch(+questionType) {
        case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
            return answerValue == 1 ? "yes" : "no";
        break;
        case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
            return answerValue;
        break;
        case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
            if(answerValue < 15) {
                return "very low";
            }
            else if(answerValue < 30) {
                return "low";
            }
            else if(answerValue < 70) {
                return "mild";
            }
            else if(answerValue < 85) {
                return "high";
            }
            else {
                return "very high";
            }
        break;
    }
}

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
            borderWidth:1
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
            onPress={() => console.log('left button clicked')}
            style={{              borderRadius: 9,
                                  borderColor: 'black',
                                  borderWidth:1,
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

    swipeContentContainerStyle: {
        justifyContent: 'center',
//        alignItems: 'center',
        borderRadius: 9,
        borderColor: 'black',
        borderWidth:1,
    },

    notAlreadyAnswered: {
      backgroundColor: '#ffffff',
    },

    alreadyAnswered: {
      backgroundColor: '#e6eee6',
    }
});