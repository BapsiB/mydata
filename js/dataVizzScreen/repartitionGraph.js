import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import Utils from '../utils.js';
import SharedConstants from '../sharedConstants.js'
import DataManager from '../dataManager'
import LinearGradient from 'react-native-linear-gradient';

const RepartitionGraph = (props) => {

    const [colours, setColours] = useState(["white", "black"]);
    const [locations, setLocations] = useState([0, 1]);

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

      const colourGreen = "white";
      const colourGrey  = "#ccc";
      const colourRed  = "black";

      const yesRatio = yesCount / (nullCount + yesCount + noCount);
      const noRatio = (yesCount + nullCount) / (nullCount + yesCount + noCount);
      const lLocation = [0, yesRatio, yesRatio,  noRatio, noRatio, 1];
      const lColours = [colourGreen, colourGreen, colourGrey,  colourGrey, colourRed, colourRed];
      setLocations(lLocation);
      setColours(lColours);
    }

    return(
        <View style={{flex:1, marginLeft:20}}>
          <LinearGradient
            start={{x: 0.0, y: 0.5}} end={{x: 1, y: 0.5}}
            locations={locations}
            colors={colours}
            style={{height:20, width:"100%"}}>
          </LinearGradient>
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