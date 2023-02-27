import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import sharedConstants from "../sharedConstants.js";
import Utils from '../utils.js';

const TextDataExtraction = (props) => {

    const [averageValue, setAverageValue] = useState(0);
    const [averageValue30, setAverageValue30] = useState(0);
    const [meanDeviation, setMeanDeviation] = useState(0);

    const data = props.data;
    const question = props.question;
    const isColour = (question.type == sharedConstants.questionTypes.QUESTION_TYPE_COLOUR);

    useEffect(() => {
      if(isColour) {
        extractColourDatas();
      }
      else {
        extractNumberDatas();
      }
        
    }, []);

    function extractColourDatas() {
      let hsvAv = {h:0, s:0, l:0};

      for(let i = 0; i < data.length; i++) {
        const value = data[i].value;
        const hsv = Utils.hexToHSL(value);
        hsvAv.h += hsv.h;
        hsvAv.s += hsv.s;
        hsvAv.l += hsv.l;
      }

      hsvAv.h = hsvAv.h / data.length;
      hsvAv.s = hsvAv.s / data.length;
      hsvAv.l = hsvAv.l / data.length;

      const avStr = "hsl(" + hsvAv.h + "," + hsvAv.s + "%," + hsvAv.l + "%)";
      setAverageValue(avStr);
    }

    function extractNumberDatas() {
        let lAverageValue = 0;
        for(let i = 0; i < data.length; i++) {
          const value = data[i].value;;
          lAverageValue += value;
        }
        lAverageValue = lAverageValue / data.length;
        setAverageValue(lAverageValue);
    
        let lMeanDeviation = 0;
        for(let i = 0; i < data.length; i++) {
          const value = data[i].value;;
          lMeanDeviation += Math.abs(value - lAverageValue);
        }
        setMeanDeviation(lMeanDeviation / data.length);
    
        let lAverageValue30 = 0;
        let valueCount = 0;
        const dateToday = new Date(Date.now());
        for(let i = 0; i < data.length; i++) {
          if(Utils.getDayDifference(data[i].date, dateToday ) < 31) {
            lAverageValue30 += data[i].value
            valueCount++;
          }
        }
        if(valueCount <= 7) {
            lAverageValue30 = "not enough data";
        }
        else {
            lAverageValue30 = lAverageValue30 / valueCount;
          setAverageValue30(lAverageValue30.toFixed(1));
        }
      }

    return(
        <View style={{flex:1, marginLeft:20}}>
          {!isColour && <View>
            <Text style={styles.valuesText}>{"average : " + averageValue.toFixed(1)}</Text>
            <Text style={styles.valuesText}>{"average in the last month: " + averageValue30}</Text>
            <Text style={styles.valuesText}>{"deviation : " + meanDeviation.toFixed(1)}</Text>
          </View>}
          {isColour && <View style={{flexDirection: "row"}}>
            <Text style={styles.valuesText}>{"average colour : "}</Text>
            <View style={{width:50, height:20, borderRadius:5, backgroundColor:averageValue}}></View>
          </View>}
          <View>
            <Text style={styles.valuesText}>{"first entry : " + data[0].date.toLocaleString('en-GB',{day:'numeric', month:'short', year:"numeric"})}</Text>
            <Text style={styles.valuesText}>{"evolution since the last 7 days : " + data[0].date.toLocaleString('en-GB',{day:'numeric', month:'short', year:"numeric"})}</Text>
            <Text style={styles.valuesText}>{"total Entry : " + data.length}</Text>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  
    valuesText: {
      fontSize:16,
      color:"black"
    },

});

export default TextDataExtraction;