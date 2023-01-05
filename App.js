import React from 'react';
//import { Provider as PaperProvider } from 'react-native-paper';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';

import DataManager from './js/dataManager.js';
import QuestionEditor from './js/questionEditor.js';
import AnswerScreen from './js/answerScreen.js';
import DataVisualisationScreen from './js/dataVisualisationScreen.js';
import HeaderDate from './js/headerDate.js';
import MenuEditQuestion from './js/menuEditQuestion.js';
import QuestionButton from './js/questionButton.js';
import NotesScreen from './js/notesScreen.js'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HeaderStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
  TransitionSpecs,
  createStackNavigator
} from '@react-navigation/stack';
import { Image, Button, TouchableOpacity, TouchableHighlight, StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';
const Stack = createNativeStackNavigator();

const BottomButton = (props) => {
return (
        <TouchableOpacity style={styles.button_footer2} onPress={()=>{props.onClick();}}>
          <Image style={{ width:50, height:50,  resizeMode: 'stretch' }} source={props.source}/>
        </TouchableOpacity>
)
}

const MyStack = () => {
const navigationRef = useNavigationContainerRef();
  
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainView}
          options={{ headerShown:false }}
        />
        <Stack.Screen name="Question Editor" component={QuestionEditor} />
        <Stack.Screen name="Answer Screen" component={AnswerScreen} />
        <Stack.Screen name="Data Visualisation Screen" component={DataVisualisationScreen} />
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
        setArrayNames(DataManager.getQuestions());
        forceUpdate();
    }

    const answersLoadedCallback = () => {
      forceUpdate();
    }

    const editQuestion = (questionId) => {
      navigation.navigate("Question Editor", {questionID:questionId});
    }

    DataManager.setQuestionsListener(updateQuestions);
    DataManager.setAnswersLoadedListener(answersLoadedCallback);

    const listItems = arrayNames.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions} editCallback={editQuestion}></QuestionButton>);
    const lListItemsContained = (props) => {return (<ScrollView style={{marginBottom:"21%"}}><SwipeProvider>{listItems}</SwipeProvider></ScrollView>)};
    //const listItems = [<Question title="number 1"></Question>, <Question title="number 2"></Question>]
    const lSizeFooter = "10%";
    const StackIn = createStackNavigator();

    const horizontalAnimation = {
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        };
      },
    };



    return (
        <View style={{ flex: 1}}>
            {HeaderDate.getHeader()}

            <Button title="button" onPress={() => navigation.navigate('Notes')}></Button>

            <StackIn.Navigator screenOptions={horizontalAnimation}>
              <StackIn.Screen
                name="Measure Questions"
                component={lListItemsContained}
                options={{ headerShown:false }}
              />
              <StackIn.Screen name="Notes" component={NotesScreen} 
              options={{horizontalAnimation}}
              />
            </StackIn.Navigator>

            <View style={{ position:'absolute', bottom:0, height:lSizeFooter, width:"100%"}}>
                <View style={{   flex: 1, flexDirection: "row"}}>
                    <BottomButton
                    source={require("./resources/curvesButton.png")}
                    onClick={function() {navigation.navigate("Data Visualisation Screen");}}/>
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

  button_footer2: {
    justifyContent: 'center',
    alignItems: 'center',
        backgroundColor: "white",
      flex: 1,
  }
});


export default MyStack;