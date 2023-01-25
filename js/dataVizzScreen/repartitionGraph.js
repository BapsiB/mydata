import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import Utils from '../utils.js';

const TextDataExtraction = (props) => {

    const [averageValue, setAverageValue] = useState(0);
    const [averageValue30, setAverageValue30] = useState(0);
    const [meanDeviation, setMeanDeviation] = useState(0);

    const data = props.data;

    useEffect(() => {
        extractDatasForText();
    }, []);

    function extractDatasForText() {
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
            <Text style={styles.valuesText}>{"average : " + averageValue.toFixed(1)}</Text>
            <Text style={styles.valuesText}>{"average in the last month: " + averageValue30}</Text>
            <Text style={styles.valuesText}>{"deviation : " + meanDeviation.toFixed(1)}</Text>
            <Text style={styles.valuesText}>{"first entry : " + data[0].date.toLocaleString('en-GB',{day:'numeric', month:'short', year:"numeric"})}</Text>
            <Text style={styles.valuesText}>{"evolution since the last 7 days : " + data[0].date.toLocaleString('en-GB',{day:'numeric', month:'short', year:"numeric"})}</Text>
            <Text style={styles.valuesText}>{"total Entry : " + data.length}</Text>
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