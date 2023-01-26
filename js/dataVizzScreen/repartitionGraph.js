import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Utils from '../utils.js';
import SharedConstants from '../sharedConstants.js'
import DataManager from '../dataManager'
import { VictoryBar, VictoryChart, VictoryAxis } from "victory-native";
import LinearGradient from 'react-native-linear-gradient';

const RepartitionGraph = (props) => {

    const [colours, setColours] = useState(["white", "black"]);
    const [locations, setLocations] = useState([]);

    const question = props.question;
    const data = question.getArrayValues(false);

    useEffect(() => {
      switch(question.type) {
        case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO: {
            processYesNo();
          break;
        }
      }
  
  }, []);

    function processYesNo() {
      if(!data.length) {
        return;
      }
      let yesCount = 0;
      let noCount = 0;
      let nullCount = 0;
      for(i in data) {
        const obj = data[i];
        const dateStr = DataManager.getDateString(obj.date);
        if(obj.value === 1) {
          yesCount++;
        }
        else if(obj.value === 0) {
          noCount++;
        }
      }

      nullCount = Utils.getDayDifference(data[0].date, data[data.length - 1].date) - yesCount - noCount;

      const colourGreen = "#d7fdd7";
      const colourGrey  = "#ddd";
      const colourRed  = "#F8a3aF";

      const yesRatio = yesCount / (nullCount + yesCount + noCount);
      const noSeRatio = nullCount / (nullCount + yesCount + noCount);
      const noRatio = noCount / (nullCount + yesCount + noCount);

      function getLabel(ratio) {
        return Math.round(ratio * 100).toString() + "%"
      }

      const lLocation = [{y:yesRatio, x:"Yes", label:getLabel(yesRatio), colour:colourGreen }, {y:noSeRatio, x:"no data", label:getLabel(noSeRatio), colour:colourGrey},  {y:noRatio, x:"No", label:getLabel(noRatio), colour:colourRed}];
      setLocations(lLocation);
    }

    function getColour(data) {
      return data.datum.colour;
    }
    
    function getGradients() {
    //   <LinearGradient id="colour2" >
    //   <Stop offset="0%" stopColor={questionToCompare ? questionToCompare.getColour() : "white"}/>
    //   <Stop offset="100%" stopColor={questionToCompare ? increase_brightness(questionToCompare.getColour(), 40) : "white"}/>
    // </LinearGradient>
    }

    return(
    <View style={{marginTop:10, paddingRight:20}}>
      <Text style={{textAlign:"center"}}>REPARTITION</Text>
          {/* <LinearGradient
            start={{x: 0.0, y: 0.5}} end={{x: 1, y: 0.5}}
            locations={locations}
            colors={colours}
            style={{height:20, width:"100%"}}>
          </LinearGradient> */}
     <VictoryChart
        animate={{duration: 500}}
        style={{}}
        width={Dimensions.get('window').width * 0.98}
      >
        {/* getGradients(); */}
        <VictoryBar
          data={locations}
          style={{
            data: { fill:getColour, width:70, stroke: "black", strokeWidth: 2 }
          }}
          cornerRadius={3}
          animate={{
            onExit: {
              duration: 500,
            }
          }}
        />
        <VictoryAxis/>
        <VictoryAxis style={{ 
          axis: {stroke: "transparent"}, 
          ticks: {stroke: "transparent"},
          tickLabels: { fill:"transparent"} 
      }} />

      </VictoryChart>
    </View>
    )
}

const styles = StyleSheet.create({
  
    valuesText: {
      fontSize:16,
      color:"black"
    },

});

export default RepartitionGraph;