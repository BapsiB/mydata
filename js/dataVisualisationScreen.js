import React from "react";
import { StyleSheet, View } from "react-native";
import { VictoryArea, VictoryChart, VictoryTheme } from "victory-native";
import DataManager from './dataManager.js';

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
      if(question) {
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
        const colour = question.colour ? question.colour : "#c43a31";
        id++;
        return (
          <VictoryArea interpolation="natural" key={id} data={item} x="date" y="value" style={{ data: { fill: "#c43a31", fillOpacity: 0.5, stroke: "#c43a31", strokeWidth: 3 } }}/>
        );
      }
    });
  }

    return (
      <View style={styles.container}>
        <VictoryChart  width={420} theme={VictoryTheme.material}>
          {renderVictoryLines()}
        </VictoryChart>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff"
  }
 });

export default DataVisualisationScreen;