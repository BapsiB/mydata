import React from "react";
import { StyleSheet, View } from "react-native";
import { VictoryArea, VictoryChart, VictoryTheme } from "victory-native";



const DataVisualisationScreen = (props) => {

  const data = [
    {quarter: 1, earnings: 13000},
    {quarter: 2, earnings: 16500},
    {quarter: 3, earnings: 14250},
    {quarter: 4, earnings: 19000}
  ];

  const data2 = [
    {quarter: 1, earnings: 9000},
    {quarter: 2, earnings: 7500},
    {quarter: 3, earnings: 17250},
    {quarter: 4, earnings: 10000}
  ];

    return (
      <View style={styles.container}>
        <VictoryChart animate={{ duration: 1000 }} width={350} theme={VictoryTheme.material}>
          <VictoryArea interpolation="natural" data={data} x="quarter" y="earnings" style={{ data: { fill: "#c43a31", fillOpacity: 0.5, stroke: "#c43a31", strokeWidth: 3 } }}/>
          <VictoryArea interpolation="natural" data={data2} x="quarter" y="earnings" style={{ data: { fill: "#043a91", fillOpacity: 0.5, stroke: "#043a91", strokeWidth: 3 } }}/>
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