import React, {useEffect} from "react";
import { StyleSheet, View, Dimensions, ScrollView, SafeAreaView, Text } from "react-native";
import { VictoryArea, VictoryLabel, VictoryScatter, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import {Defs, LinearGradient, Stop} from "react-native-svg";
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';
import { parseSync } from "@babel/core";

const DataVisualisationSingleQuestion = (props) => {

  const question = DataManager.getQuestionWithId(props.route.params.questionId);

  const data = question.getArrayValues();
  const dataAv = [];
  const averagePointCount = 7;
  const colourAverage = "#833"
  for(let i = 0; i < data.length; i++) {
    const actualPointCount = Math.min(i, averagePointCount);
    let valueAv = data[i].value;
    for(let j = 1; j <= actualPointCount; j++) {
      valueAv += data[i - j].value;
    }
    valueAv = valueAv / (actualPointCount + 1);
    dataAv.push({date:data[i].date, value:valueAv});
  }

  const renderVictoryLines = () => {
    let id = 0;
    let components = [];
    const colour = question.getColour() ? question.getColour() : "#c43a31";
    return <VictoryArea interpolation="step" key={id} data={data} x="date" y="value" style={{ data: { fill: 'url(#gradientStroke)', fillOpacity: 0.5, stroke: colour, strokeWidth: 1 } }}/>;
  }

  const renderAverageLine = () => {
    let id = 0;
    
    return (
        <VictoryLine interpolation="natural" key={id} data={dataAv} x="date" y="value" style={{ data: {  stroke: colourAverage, strokeWidth: 2 } }}/>
    )
  }

  const renderAverageLabel = () => {
    return (
      <VictoryScatter
      style={{ data: { fill: "transparent" } }}
      data={[{ value: dataAv[0].value, date: dataAv[0].date }]}
      labels="average"
      x="date" y="value"
      labelComponent={
        <VictoryLabel angle={-45} dx={10} dy={3} textAnchor="start" style={{ fill: colourAverage }}/>
      }
    />
    )
  }

  const forceUpdate = React.useReducer(() => ({}))[1]

  function getStringDate(ms) {
    // date.toString();
    const date = new Date(ms);
    return date.toLocaleString('en-us',{day:'2-digit', month:'short'})
  }


  function questionUpdate() {
    forceUpdate();
  }

  return (
    <View style={{flex:1}}>
    <SafeAreaView style={styles.container}>
      <ScrollView style={{width:400, height:200}} >
      <View style={{width:Dimensions.get('window').width, height:1200}}>
      <VictoryChart  width={Dimensions.get('window').width} theme={VictoryTheme.material}   containerComponent={
          <VictoryZoomContainer/>
        }>
      <Defs>
        <LinearGradient id="gradientStroke" >
          <Stop offset="0%" stopColor={question.getColour()}/>
          <Stop offset="100%" stopColor={increase_brightness(question.getColour(), 40)}/>
        </LinearGradient>
      </Defs>
      <VictoryAxis
        tickFormat={x => getStringDate(x)}
        style={{ ticks: { size: 4 } }}
        tickCount={4} 
      />
      <VictoryAxis
        tickValues={[0, 1]}
        style={{ ticks: { size: 3 } }}
        tickFormat={x => SharedConstants.getAnswerText(x, question)}
        dependentAxis
      />
        {renderVictoryLines()}
        {renderAverageLine()}
        {renderAverageLabel()}
      </VictoryChart>
      </View>
      </ScrollView>
    </SafeAreaView>

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

 function increase_brightness(hex, percent){
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if(hex.length == 3){
      hex = hex.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

  return '#' +
     ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}


export default DataVisualisationSingleQuestion;