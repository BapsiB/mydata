import React, {useEffect} from "react";
import { StyleSheet, View, Dimensions, ScrollView, SafeAreaView, Text } from "react-native";
import { VictoryArea, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import DataManager from './dataManager.js';
import SharedConstants from './sharedConstants.js';
import QuestionVizzList from './dataVizzScreen/questionVizzList.js';

const DataVisualisationScreen = (props) => {

  const allData = DataManager.getAllData();



  let data = [];
  allData.forEach((val, index) => {
    const dateStr = index.toString();
    // your code goes here 
    val.forEach((dayVal, questionIndex) => {
      if(data[questionIndex] === undefined) {
        data[questionIndex] = [];
      }

      const question = DataManager.getQuestionWithId(questionIndex);
      const visibility = DataManager.getQuestionVisibility(questionIndex);
      if(question && visibility) {
        const valNorm = question.normalizeValue(dayVal);
        if(dayVal) {
          const arrayEl = {date:DataManager.getDateFromString(dateStr), value:valNorm};
          data[questionIndex].push(arrayEl);
        }
      }
    })
  })

  const renderVictoryLines = () => {
    let id = 0;
    let components = [];
    data.forEach((item, index) => {
      if(item.length > 1) {
        const question = DataManager.getQuestionWithId(index);
        const colour = question.getColour() ? question.getColour() : "#c43a31";
        id++;
        components.push(<VictoryArea interpolation="natural" key={id} data={item} x="date" y="value" style={{ data: { fill: colour, fillOpacity: 0.5, stroke: shadeColor(colour, -40), strokeWidth: 3 } }}/>);
      }
    });
    return components;
  }


  const forceUpdate = React.useReducer(() => ({}))[1]
  

  function getStringDate(ms) {
    // date.toString();
    const date = new Date(ms);
    const humanDateFormat = date.getDay() + "/" + (date.getMonth() + 1)
    return humanDateFormat;
  }

  function questionUpdate() {
    forceUpdate();
  }

    return (
      <View style={{flex:1}}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width:400, height:200}} >
        <View style={{width:Dimensions.get('window').width * 2, height:1200}}>
        <VictoryChart  width={Dimensions.get('window').width * 2} theme={VictoryTheme.material}   containerComponent={
            <VictoryZoomContainer/>
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
      </SafeAreaView>

      <QuestionVizzList  changeCallback={questionUpdate}/>

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