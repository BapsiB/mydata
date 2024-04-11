import React, {useRef, useEffect} from "react";
import { StyleSheet, View, Dimensions, ScrollView, SafeAreaView, Text } from "react-native";
import { VictoryArea, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';
import QuestionVizzList from './questionVizzList.js';
import DataVisualisationSingleQuestion from './dataVisualisationSingleQuestion'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Utils from '../utils.js'
import dataManager from "../dataManager.js";

const DataVisualisationScreen = () => {


  function getStackNavigator() {
    listQuestions = DataManager.getQuestions();
    let optionsForth = Utils.horizontalScreenAnimation;
    optionsForth.headerShown = false;
    // let optionsBack = Utils.horizontalScreenAnimationRightToLeft;
    // optionsBack.headerShown = false;
    const listItemsforth = listQuestions.map((d) => <Stack.Screen name={d.id + "vizz"} component={DataVisualisationSingleQuestion} options={{headerShown:false}} key={d.id} initialParams={{ questionId: d.id }} />);
    // basically because i didn't find a better way, we put twice the screens with different animation.
    // const listItemsback = listQuestions.map((d) => <StackIn.Screen name={d.id + "-back"} component={DataVisualisationSingleQuestion} options={optionsBack} key={d.id + "-back"} initialParams={{ questionId: d.id }} />);
    return listItemsforth;//.concat(listItemsback);
  }

  const Stack = createNativeStackNavigator();

  return (
      <Stack.Navigator>
        <Stack.Screen name="All" component={DataVisualisationAll} options={{headerShown:false}} />
        {getStackNavigator()}
      </Stack.Navigator>
  )
};

const DataVisualisationAll = (props) => {

  const questions = DataManager.getQuestions();

  let data = [];
  for(let i in questions) {
    const question = questions[i];
    if(dataManager.getQuestionVisibility(question.id)) {
      const values = question.getArrayValues({normalizeValue:true, writeDateInString:false});
      const mult = 0.1 + 0.9 * ((questions.length - i) / questions.length);
      for(let j in values) {
        values[j].value *= mult;
      }
      data.push({questionId:question.id, values:values});
    }
  }

  const renderVictoryLines = () => {
    let id = 0;
    let components = [];
    for(let i in data) {
      const questionData = data[i];
      const item = questionData.values;
      const coeff = 0.1 + 0.85 * (data.length - i) / data.length;
      if(item.length > 1) {
        const question = DataManager.getQuestionWithId(questionData.questionId);
        const colour = question.getColour() ? question.getColour() : "#c43a31";
        id++;
        interpolation = (question.type == SharedConstants.questionTypes.QUESTION_TYPE_YES_NO) ? "step" : "monotoneX";
        components.push(<VictoryArea interpolation={interpolation} key={id} data={item} x="date" y="value" style={{ data: { fill: Utils.increase_brightness(colour, coeff * 90), fillOpacity: 1, stroke: Utils.increase_brightness(colour, coeff * 60), strokeWidth: 3 } }}/>);
      }
    }
    return components;
  }
  
  const scrollRef = useRef();

  useEffect(() => {
    // scrollRef.current.scrollToEnd({animated: true})
  }, []);

  const forceUpdate = React.useReducer(() => ({}))[1]

  function getStringDate(ms) {
    // date.toString();
    const date = new Date(ms);
    return date.toLocaleString('en-us',{day:'2-digit', month:'short'})
  }

  function questionUpdate() {
    forceUpdate();
  }

  function goToQuestionVizz(questionId) {
    props.navigate(questionID);
  }

    return (
      <View style={{flex:1}}>
      {/* <SafeAreaView style={styles.container}>
        <ScrollView ref={scrollRef} contentOffset={{x:300, y:0}} persistentScrollbar={true} horizontal={true}  style={{width:400, height:200}} width={400} height={200}>
        <View style={{width:Dimensions.get('window').width * 2, height:1200}}>
        <VictoryChart width={Dimensions.get('window').width * 2} theme={VictoryTheme.material}   containerComponent={
            <VictoryZoomContainer allowPan={false} zoomDimension="x" width={Dimensions.get('window').width * 2}/>
          }>
        <VictoryAxis
          tickFormat={x => getStringDate(x)}
        />
        <VictoryAxis
          tickValues={[0]}
          style={{ ticks: { size: 0 } }}
          tickFormat={x => ''}
          dependentAxis
          // tickFormat specifies how ticks should be displayed
        />
          {renderVictoryLines()}
          
        </VictoryChart>
        </View>
        </ScrollView>
      </SafeAreaView> */}

      <QuestionVizzList  changeCallback={questionUpdate} navigation={props.navigation}/>

      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
 });

 function shadeColor(color, percent) {

  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  R = Math.round(R / 10) * 10
  G = Math.round(G / 10) * 10
  B = Math.round(B / 10) * 10

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

export default DataVisualisationScreen;