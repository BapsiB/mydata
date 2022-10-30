import React from 'react';
//import { Provider as PaperProvider } from 'react-native-paper';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';

import DataManager from './js/dataManager.js';
import QuestionEditor from './js/questionEditor.js';
import AnswerScreen from './js/answerScreen.js';
import HeaderDate from './js/headerDate.js';
import MenuEditQuestion from './js/menuEditQuestion.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, TouchableHighlight, StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';

const Stack = createNativeStackNavigator();
const sDataManager = DataManager;
const Question = (props) => {

  const goToQuestion = () => props.navigation.navigate("Answer Screen", props.questionId);

  const requestDelete = () => {
    if(DataManager.deleteQuestion(props.questionId)) {
        props.changeCallback();
    }
  };

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
//                paddingRight:5,

              borderRadius: 9,
              borderColor: 'black',
              borderWidth:1
            }}

        >
            <TouchableOpacity
                onPress={() => {requestDelete();}}
            >
                <Image style={{ width:46, height:46,  resizeMode: 'stretch' }} source={require("./resources/delete.png")}/>
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
//                paddingRight:5,


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
                <Image style={{ width:40, height:40,  resizeMode: 'stretch' }} source={require("./resources/pencil.png")}/>
            </TouchableOpacity>
        </SwipeButtonsContainer>
    );


  return (

  <SwipeItem
      style={styles.questionsButtons}
      swipeContainerStyle={styles.swipeContentContainerStyle}
      leftButtons={leftButton}
      rightButtons={rightButton}
  >
        <Text style={{fontSize: 16, color:"black", textAlign:"center"}}>
            {props.title}
        </Text>
  </SwipeItem>


  );
}

const BottomButton = (props) => {
return (
        <TouchableOpacity style={styles.button_footer2} onPress={()=>{props.onClick();}}>
          <Image style={{ width:50, height:50,  resizeMode: 'stretch' }} source={props.source}/>
        </TouchableOpacity>
)
}

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainView}
          options={{ headerShown:false }}
        />
        <Stack.Screen name="Question Editor" component={QuestionEditor} />
        <Stack.Screen name="Answer Screen" component={AnswerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainView = ({ navigation }) => {

    const unsubscribe = navigation.addListener('state', (e) => {
      // You can get the raw navigation state (partial state object of the root navigator)
      console.log(e.data.state);
      if(e.data.state.routeNames[e.data.state.index] == "Home") {
        forceUpdate();
      }
    });

    const forceUpdate = React.useReducer(() => ({}))[1]

    const [arrayNames, setArrayNames] = React.useState([]);

    const updateQuestions = () => {
        setArrayNames(sDataManager.getQuestions());
        forceUpdate();
    }

    sDataManager.setQuestionsListener(updateQuestions);

    const listItems = arrayNames.map((d) => <Question title={d.text} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions}></Question>);
    //const listItems = [<Question title="number 1"></Question>, <Question title="number 2"></Question>]
    const lSizeFooter = "10%";
    return (

        <View style={{ flex: 1}}>
            {HeaderDate.getHeader()}

            <ScrollView style={{marginBottom:"21%"}}>
            <SwipeProvider>
                {listItems}
            </SwipeProvider>
            </ScrollView>

            <View style={{ position:'absolute', bottom:0, height:lSizeFooter, width:"100%"}}>
                <View style={{   flex: 1, flexDirection: "row"}}>
                    <BottomButton
                    source={require("./resources/curvesButton.png")}
                    onClick={function() {}}/>
                    <BottomButton source={require("./resources/plusButton.png")} onClick={function() {navigation.navigate("Question Editor");}}/>
                    <BottomButton source={require("./resources/shareButton.png")}/>
                </View>
           </View>
        </View>
    );
}

const styles = StyleSheet.create({
  button_footer: {
        backgroundColor: "white",
//      bottom: 0 ,
      flex: 1,
  },

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
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 9,
          borderColor: 'black',
          borderWidth:1,
      },

    button_footer2: {
      justifyContent: 'center',
      alignItems: 'center',
          backgroundColor: "white",
        flex: 1,
    }
});


export default MyStack;