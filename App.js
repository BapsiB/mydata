import React from 'react';
//import { Provider as PaperProvider } from 'react-native-paper';
import { SwipeItem, SwipeButtonsContainer, SwipeProvider } from 'react-native-swipe-item';

import DataManager from './js/dataManager.js';
import QuestionEditor from './js/questionEditor.js';
import AnswerScreen from './js/answerScreen.js';
import HeaderDate from './js/headerDate.js';
import MenuEditQuestion from './js/menuEditQuestion.js';
import QuestionButton from './js/questionButton.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, TouchableHighlight, StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';

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

    DataManager.setQuestionsListener(updateQuestions);

    const listItems = arrayNames.map((d) => <QuestionButton title={d.text} date={HeaderDate.getDate()} questionId={d.id} key={d.id} navigation={navigation} changeCallback={updateQuestions}></QuestionButton>);
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





    button_footer2: {
      justifyContent: 'center',
      alignItems: 'center',
          backgroundColor: "white",
        flex: 1,
    }
});


export default MyStack;