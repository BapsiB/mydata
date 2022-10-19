import React from 'react';
import DataManager from './js/dataManager.js';
import QuestionEditor from './js/questionEditor.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, AsyncStorage, StyleSheet, Text, Button, View } from 'react-native';

const Stack = createNativeStackNavigator();
const sDataManager = new DataManager();

const Question = (props) => {
  return (
    <Button
    key={props.key_app}
    title={props.title}
    color="#841584"
    accessibilityLabel="Learn more about this purple button"
    />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainView = ({ navigation }) => {
    const [arrayNames, setArrayNames] = React.useState(sDataManager.getQuestions());

//    setArrayNames(sDataManager.getQuestions());

    const listItems = arrayNames.map((d) => <Question title={d.text} key_app={d.id}></Question>);
    //const listItems = [<Question title="number 1"></Question>, <Question title="number 2"></Question>]





  return (
        <View style={{ flex: 1}}>
            {listItems}
            <View style={{ position:'absolute', bottom:0, height:"10%", width:"100%"}}>
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

    button_footer2: {
      justifyContent: 'center',
      alignItems: 'center',
          backgroundColor: "white",
        flex: 1,
    }
});


export default MyStack;