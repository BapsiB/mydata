import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { useRef } from 'react';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';

export default QuestionButton = (props) => {

  const itemRef = useRef(true);

  const requestDelete = () => {
    if(DataManager.deleteQuestion(props.questionId)) {
        props.changeCallback();
        itemRef.current.close();
    }   
  };

  const openQuestionVisu = () => {

  };

  return (
  <TouchableOpacity style={{height:"100%", textAlign: 'center', justifyContent: 'center',}} onPress={()=>{openQuestionVisu();}}>
        <Text style={{fontSize: 16, color:"black", textAlign: 'center', justifyContent: 'center'}}>
            {props.title}
        </Text>
  </TouchableOpacity>
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

    swipeContentContainerStyle: {
        justifyContent: 'center',
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