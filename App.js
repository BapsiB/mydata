import React from 'react';
import DataManager from './js/dataManager.js';
import QuestionEditor from './js/questionEditor.js';
import AnswerScreen from './js/answerScreen.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';

const Stack = createNativeStackNavigator();
const sDataManager = DataManager;

const Question = (props) => {

const goToQuestion = () => props.navigation.navigate("Answer Screen", props.questionId);

  return (
    <TouchableOpacity
        style={styles.questionsButtons}
        onPress={goToQuestion}
    >
      <Text style={{fontSize: 16, color:"black"}}>
        {props.title}
      </Text>
    </TouchableOpacity>

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
          options={{ title: 'Questions' }}
        />
        <Stack.Screen name="Question Editor" component={QuestionEditor} />
        <Stack.Screen name="Answer Screen" component={AnswerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainView = ({ navigation }) => {

    const forceUpdate = React.useReducer(() => ({}))[1]

    const [arrayNames, setArrayNames] = React.useState(sDataManager.getQuestions());

    const updateQuestions = () => {
        setArrayNames(sDataManager.getQuestions());
        forceUpdate();
    }

    sDataManager.setQuestionsListener(updateQuestions);

    const listItems = arrayNames.map((d) => <Question title={d.text} questionId={d.id} key={d.id} navigation={navigation}></Question>);
    //const listItems = [<Question title="number 1"></Question>, <Question title="number 2"></Question>]
    const lSizeFooter = "10%";
  return (
        <View style={{ flex: 1}}>
            <SafeAreaView style={{marginBottom:"20%"}}>
                <ScrollView style={styles.scrollView}>
                {listItems}
                </ScrollView>
            </SafeAreaView>
            <View style={{ position:'absolute', bottom:0, height:lSizeFooter, width:"100%"}}>
                <View style={{   flex: 1, flexDirection: "row"}}>
                    <BottomButton
                    source={require("./resources/curvesButton.png")}
                    onClick={function() {}}/>
                    <BottomButton source={require("./resources/plusButton.png")} onClick={function() {navigation.navigate("Question Editor", sDataManager);}}/>
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
    borderWidth:1,
    borderRadius:10,
    height:50,
    flex:1,
    backgroundColor:"white",
    borderColor:"black",
    justifyContent: 'center',
    alignItems: 'center',
  },

    button_footer2: {
      justifyContent: 'center',
      alignItems: 'center',
          backgroundColor: "white",
        flex: 1,
    }
});


export default MyStack;