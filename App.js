import React from 'react';

import DataManager from './js/dataManager.js';
import QuestionEditor from './js/questionEditor.js';
import AnswerScreen from './js/answerScreen.js';
import DataVisualisationScreen from './js/dataVisualisationScreen.js';
import HeaderDate from './js/headerDate.js';
import MenuEditQuestion from './js/menuEditQuestion.js';
import QuestionButton from './js/questionButton.js';
import NotesScreen from './js/questionsScreens/notesScreen.js'
import MeasureScreen from './js/questionsScreens/measuresScreen.js'
import Utils from './js/utils.js'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createStackNavigator
} from '@react-navigation/stack';
import { Image, TouchableOpacity, TouchableHighlight, StyleSheet, Text, Pressable, View, SafeAreaView } from 'react-native';

const Stack = createNativeStackNavigator();

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

    const lSizeFooter = "8%";
    const StackIn = createStackNavigator();

    return (
        <View style={{ flex: 1}}>
            {HeaderDate.getHeader()}
            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.buttonsTypeQuestions}>
              <TouchableOpacity style={{}} onPress={()=>{navigation.navigate("Measures")}}>
                <Image style={{ width:32, height:32,  resizeMode: 'stretch' }} source={require("./resources/measuresButton.png")}/>
              </TouchableOpacity>
              </View>
              <View style={styles.buttonsTypeQuestions}>
              <TouchableOpacity style={{}} onPress={()=>{navigation.navigate("Notes")}}>
                <Image style={{ width:32, height:32,  resizeMode: 'stretch' }} source={require("./resources/notesbutton.png")}/>
              </TouchableOpacity>
              </View>
            </View>

            <StackIn.Navigator screenOptions={Utils.horizontalScreenAnimation} >
              <StackIn.Screen
                name="Measures"
                component={MeasureScreen}
                options={{ headerShown:false }}
              />
              <StackIn.Screen name="Notes" 
                component={NotesScreen} 
                options={{headerShown:false}}
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

buttonsTypeQuestions: {
  margin:30,  
},

  button_footer2: {
    justifyContent: 'center',
    alignItems: 'center',
        backgroundColor: "white",
      flex: 1,
  }
});


export default MyStack;