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

      data[questionIndex].push({date:DataManager.getDateFromString(dateStr), value:dayVal});
    })
  })

  const renderVictoryLines = () => {
    return data.map((item) => {
      const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    const colour = `#${randomColor}`;
  
        return (
          <VictoryArea interpolation="natural" data={item} x="date" y="value" style={{ data: { fill: colour, fillOpacity: 0.5, stroke: colour, strokeWidth: 3 } }}/>
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