import React, {useEffect} from "react";
import { StyleSheet, View, Dimensions, ScrollView, SafeAreaView, Text } from "react-native";
import { VictoryArea, VictoryLabel, VictoryScatter, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import {Defs, LinearGradient, Stop} from "react-native-svg";
import DataManager from '../dataManager.js';
import Utils from '../utils.js';
import SharedConstants from '../sharedConstants.js';
import { parseSync } from "@babel/core";

const DataVisualisationSingleQuestion = (props) => {

  const question = DataManager.getQuestionWithId(props.route.params.questionId);

  const data = question.getArrayValues(false);
  const dataAv = [];
  const averagePointCount = 7;
  let averageValue = 0;
  let averageValue30 = 0;
  let meanDeviation = 0;
  const colourAverage = "#833"
  
  function processAverageChart() {
    for(let i = 0; i < data.length; i++) {
      const actualPointCount = Math.min(i, averagePointCount);
      let valueAv = data[i].value;
      for(let j = 1; j <= actualPointCount; j++) {
        valueAv += data[i - j].value;
      }
      valueAv = valueAv / (actualPointCount + 1);
      dataAv.push({date:data[i].date, value:valueAv});
    }
  }
  processAverageChart();

  function extractDatasForText() {
    averageValue = 0;
    for(let i = 0; i < data.length; i++) {
      const value = data[i].value;;
      averageValue += value;
    }
    averageValue = averageValue / data.length;

    meanDeviation = 0;
    for(let i = 0; i < data.length; i++) {
      const value = data[i].value;;
      meanDeviation += Math.abs(value - averageValue);
    }
    meanDeviation = meanDeviation / data.length;

    let valueCount = 0;
    const dateToday = new Date(Date.now());
    const dataLast30Days = [];
    for(let i = 0; i < data.length; i++) {
      if(Utils.getDayDifference(data[i].date, dateToday ) < 31) {
        averageValue30 += data[i].value
        valueCount++;
      }
    }
    if(valueCount <= 7) {
      averageValue30 = "not enough data";
    }
    else {
      averageValue30 = averageValue30 / valueCount;
      averageValue30 = averageValue30.toFixed(1);
    }
  }
  extractDatasForText();

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
      labels={["average"]}
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

  function getTickValues() {
    switch(question.type) {
      case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
        return [0, 1];
      case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
        return [0, 25, 75, 100];
      case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
        return [+question.options.min, +question.options.max];
    }
  }

  return (
    <View style={{flex:1}}>
    <Text style={styles.questionText}
        adjustsFontSizeToFit={true}
        numberOfLines={2}
    >{question.text}</Text>
    <SafeAreaView style={styles.container}>
      <View style={{width:Dimensions.get('window').width}}>
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
        tickValues={getTickValues()}
        style={{ ticks: { size: 3 } }}
        tickFormat={x => SharedConstants.getAnswerText(x, question)}
        dependentAxis
      />
        {renderVictoryLines()}
        {renderAverageLine()}
        {renderAverageLabel()}
      </VictoryChart>
      </View>

    </SafeAreaView>
    <View style={{flex:1, marginLeft:20}}>
    <Text style={styles.valuesText}>{"average : " + averageValue.toFixed(1)}</Text>
    <Text style={styles.valuesText}>{"average in the last month: " + averageValue30}</Text>
    <Text style={styles.valuesText}>{"deviation : " + meanDeviation.toFixed(1)}</Text>
    <Text style={styles.valuesText}>{"first entry : " + data[0].date.toLocaleString('en-GB',{day:'numeric', month:'short', year:"numeric"})}</Text>
    <Text style={styles.valuesText}>{"evolution since the last 7 days : " + data[0].date.toLocaleString('en-GB',{day:'numeric', month:'short', year:"numeric"})}</Text>
    <Text style={styles.valuesText}>{"total Entry : " + data.length}</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },

  valuesText: {
    fontSize:16,
    color:"black"
  },

  questionText: {
    marginVertical:0,
    marginHorizontal:20,
    color: 'black',
    fontSize: 25,
    fontWeight: '500',
    marginTop:20,
    textAlignVertical:'center',
    textAlign:'center',
},
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