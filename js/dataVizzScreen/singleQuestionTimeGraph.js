import React, {useEffect, useState, useRef} from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
import ChartVsDropdownPicker from './chartVSDropdownPicker.js'
import { VictoryArea, VictoryLabel, VictoryScatter, VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import {Defs, LinearGradient, Stop} from "react-native-svg";
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js'

const SngleQuestionTimeGraph = (props) => {

    const question = DataManager.getQuestionWithId(props.questionId);
    data = props.data;
    const dataAv = [];
    const averagePointCount = 7;
    const colourAverage = "#833";

    const [questionToCompare, setQuestionToCompare] = useState(null);
    const [dataToCompare, setDataToCompare] = useState([]);
    const [firstRender, setFirstRender] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
        processAverageChart();
        setTimeout(() => {
          setFirstRender(false);

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();

        }, 100);
      }, [fadeAnim]);

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

      const renderVictoryLines = () => {
        let id = 0;
        let dataStyle = {};
        const colour = question.getColour() ? question.getColour() : "#c43a31";
    
        dataStyle = { fill: 'url(#gradientStroke)', fillOpacity: 0.5, stroke: colour, strokeWidth: 1 }
        return <VictoryArea interpolation="step" key={id} data={data} x="date" y="value" style={{ data:dataStyle  }}/>;
      }

  /*
  * render the secondary chart to compare values with.
  */
  const renderComparisonLines = () => {
    if(!questionToCompare) {
      return null;
    }

    let components = [];
    const colour = questionToCompare.getColour() ? questionToCompare.getColour() : "#c43a31";
    width = 0.4 * Dimensions.get('window').width / data.length;
    // return <VictoryArea interpolation="step" key={questionToCompare.id} data={dataToCompare} x="date" y="value" style={{ data: { fill: 'url(#gradientStroke)', fillOpacity: 0.3, stroke: colour, strokeWidth: 1 } }}/>;
    return (<VictoryBar
      cornerRadius={{ top: width * 0.5}}
      x="date" y="value"
      barWidth={width}
      style={{
        data: { fill: 'url(#gradientFillCompare)', fillOpacity: 1, stroke: colour, strokeWidth: 1 }
      }}
      data={dataToCompare}
    />)
  }

  const renderAverageLine = () => {
    if(questionToCompare) {
      return null;
    }
    let id = 999999;
    return (
        <VictoryLine interpolation="natural" key={id} data={dataAv} x="date" y="value" style={{ data: {  stroke: colourAverage, strokeWidth: 2 } }}/>
    )
  }

  const renderAverageLabel = () => {
    if(questionToCompare || !dataAv.length) {
      return null;
    }
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

  function getStringDate(ms) {
    // date.toString();
    const date = new Date(ms);
    return date.toLocaleString('en-us',{day:'2-digit', month:'short'})
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

  function setExtraChart(id) {
    if(id > 0) {
      const lQuestion = DataManager.getQuestionWithId(id);
      setQuestionToCompare(lQuestion);
      const lData = lQuestion.getArrayValues(true);

      for(let i in lData) {
        lData[i].value = lData[i].value * question.getMax() * 1 + 0.2;
      }
      setDataToCompare(lData);
    }
    else {
      setQuestionToCompare(null);
    }
  } 

  return(
    <View style={[styles.container, {zIndex: 1, height:Dimensions.get('window').width * 0.95}]}>
    { !firstRender && 
    <Animated.View // Special animatable View
    style={{
      opacity: fadeAnim, // Bind opacity to animated value
    }}>
    <View style={{marginBottom:30, paddingBottom:30}}>
    
    <VictoryChart  
    domain={{ y: [question.getMin(), question.getMax() * 1.05] }}
    width={Dimensions.get('window').width} 
    theme={VictoryTheme.material}   
    containerComponent={
      <VictoryZoomContainer allowPan={true} zoomDimension="x"/>
      }
    >
    <Defs>
      <LinearGradient id="gradientStroke" >
        <Stop offset="0%" stopColor={question.getColour()}/>
        <Stop offset="100%" stopColor={increase_brightness(question.getColour(), 40)}/>
      </LinearGradient>
      <LinearGradient id="gradientFillCompare" >
        <Stop offset="0%" stopColor={questionToCompare ? questionToCompare.getColour() : "white"}/>
        <Stop offset="100%" stopColor={questionToCompare ? increase_brightness(questionToCompare.getColour(), 40) : "white"}/>
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
      {renderComparisonLines()}
      {renderAverageLine()}
      {renderAverageLabel()}
    </VictoryChart>
    <ChartVsDropdownPicker  excludeQuestionId={question.id} callback={setExtraChart}/>
    </View>
    </Animated.View>
    }
  </View>
  )
    
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    borderColor:"grey",
    backgroundColor:"#f8f8f8",
    margin:5,
    borderWidth:0,
    borderRadius:10,
     // 1 for stacking the element on top of the previous element and -1 
             // for stacking the element under the above previous element.
    elevation: 1,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,


    // justifyContent: "center",
    // alignItems: "center",
  },
})

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


export default SngleQuestionTimeGraph;