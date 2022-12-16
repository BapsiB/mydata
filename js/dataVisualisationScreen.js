import React from "react";
import { StyleSheet, View } from "react-native";
import { VictoryArea, VictoryChart, VictoryTheme } from "victory-native";
import DataManager from './dataManager.js';

const DataVisualisationScreen = (props) => {

  const allData = DataManager.getAllData();

  let data = [];
  allData.forEach((val, index) => {
    const date = index;
    // your code goes here 
    val.forEach((dayVal, questionIndex) => {
      if(data[questionIndex] === undefined) {
        data[questionIndex] = [];
      }
      if(dayVal == null) {
        dayVal = 0; //TODO: set an unvalid value.
      }
      data[questionIndex].push({date:date, value:dayVal});
    })
  })

  const renderVictoryLines = () => {
    return data.map((item) => {
        return (
          <VictoryArea interpolation="natural" data={item} x="date" y="value" style={{ data: { fill: "#c43a31", fillOpacity: 0.5, stroke: "#c43a31", strokeWidth: 3 } }}/>
        );
    });
  }

    return (
      <View style={styles.container}>
        <VictoryChart animate={{ duration: 1000 }} width={450} theme={VictoryTheme.material}>
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