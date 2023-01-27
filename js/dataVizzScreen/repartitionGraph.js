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
    const [widthBars, setWidthBars] = useState([70]);
    const [groupValues, setGroupValues] = useState(false);

    const question = props.question;
    const data = question.getArrayValues(false);

    useEffect(() => {
      switch(question.type) {
        case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO: {
          processYesNo();
          break;
        }
        case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER: {
          processNumber();
          break;
        }
        case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY: {
          processNumber();
          break;
        }
      }
  
  }, []);

  function processNumber() {
    if(!data.length) {
      return;
    }

    const min = question.getMin();
    const max = question.getMax();
    const useAllValuesAsX = (max - min) < 20;
    const lLocation = [];
    if(!useAllValuesAsX) {
      for(let i = 0; i < 8; i++) {
        let xValue = "";
        switch(i) {
          case 0:
          xValue = "very low";
          break;
          case 2:
          xValue = "low";
          break;
          case 4:
          xValue = "medium";
          break;
          case 6:
          xValue = "high";
          break;
          case 8:
          xValue = "very high";
          break;
          default:
            xValue = i.toString();
        }
        lLocation.push({y:0, x:xValue, label:"", colour:"white"});
      }
    }
    else {
      for(let i = +min; i <= +max; i++) {
        lLocation.push({y:0, x:i.toString(), label:"", colour:"white"});
      }
    }

    const addVal = 100 / data.length;
    for(let i in data) {
      const obj = data[i];
      if(useAllValuesAsX) {
        const index = Math.min(obj.value - min, lLocation.length - 1);
        lLocation[index].y += addVal;
      }
      else {
        let index = (obj.value - question.getMin()) / question.getMax();
        index *= lLocation.length;
        index = Math.floor(index);
        index = Math.min(index, lLocation.length - 1);
        lLocation[index].y += addVal;
      }
    }

    let maxIndex = 0;
    let maxValue = 0;
    for(let j in lLocation) {
      if(lLocation[j].y > maxValue) {
        maxValue = lLocation[j].y;
        maxIndex = j;
      }
    }
    
    lLocation[maxIndex].label = Math.round(lLocation[maxIndex].y).toString() + "%";
    const questionColour = question.colour;
    for(let k in lLocation) {
      const lColour = Utils.increase_brightness(questionColour, 40 * (maxValue - lLocation[k].y) / maxValue);
      lLocation[k].colour = lColour;
    }
    setWidthBars(Dimensions.get('window').width * 0.5 / lLocation.length);
    setLocations(lLocation);
    setGroupValues(!useAllValuesAsX);
  }

    function processYesNo() {
      if(!data.length) {
        return;
      }
      let yesCount = 0;
      let noCount = 0;
      let nullCount = 0;
      for(let i in data) {
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
      setWidthBars(70);
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

    function getTickDisplay(x) {
      if(groupValues) {
        if(isNaN(x)) {
          return x;
        }
        else {
          return "";
        }
      }
      return x;
    }

    return(
    <View style={{marginTop:10, paddingRight:20}}>
      <Text style={{textAlign:"center", color:"grey"}}>REPARTITION</Text>
          {/* <LinearGradient
            start={{x: 0.0, y: 0.5}} end={{x: 1, y: 0.5}}
            locations={locations}
            colors={colours}
            style={{height:20, width:"100%"}}>
          </LinearGradient> */}
     <VictoryChart
        domainPadding={30}
        style={{}}
        width={Dimensions.get('window').width * 0.98}
      >
        {/* getGradients(); */}
        <VictoryBar
          data={locations}
          style={{
            data: { fill:getColour, width:widthBars, stroke: "black", strokeWidth: 2 }
          }}
          cornerRadius={3}
        />
        <VictoryAxis
        tickFormat={x => getTickDisplay(x)}
        />
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