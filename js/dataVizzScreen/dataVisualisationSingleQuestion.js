import React, {useEffect} from "react";
import { StyleSheet, View, Dimensions, ScrollView, SafeAreaView, Text } from "react-native";
import { VictoryArea, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';

const DataVisualisationSingleQuestion = (props) => {

  const question = DataManager.getQuestionWithId(props.route.params.questionId);

  let data = [];
  const values = question.getArrayValues();

  const renderVictoryLines = () => {
    let id = 0;
    let components = [];
    const data = question.getArrayValues();
    const colour = question.getColour() ? question.getColour() : "#c43a31";
    return <VictoryArea key={id} data={data} x="date" y="value" style={{ data: { fill: colour, fillOpacity: 0.5, stroke: shadeColor(colour, -40), strokeWidth: 3 } }}/>;
  }

  const forceUpdate = React.useReducer(() => ({}))[1]

  function getStringDate(ms) {
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
      <View style={{width:Dimensions.get('window').width, height:1200}}>
      <VictoryChart  width={Dimensions.get('window').width} theme={VictoryTheme.material}   containerComponent={
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

export default DataVisualisationSingleQuestion;