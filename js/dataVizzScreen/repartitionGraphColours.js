import React, {useEffect, useState, useRef} from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import Utils from '../utils.js';
import SharedConstants from '../sharedConstants.js'
import DataManager from '../dataManager'
import { VictoryBar, VictoryArea, VictoryChart, VictoryAxis } from "victory-native";
import {Defs, LinearGradient, Stop} from "react-native-svg";

/*
* repartition graph applied to colours.
*/
const RepartitionGraphColours = (props) => {

    const [colours, setColours] = useState(["white", "black"]);
    const [locations, setLocations] = useState([]);
    const [locationsHUE, setLocationsHUE] = useState([]);
    const [widthBars, setWidthBars] = useState([70]);
    const [firstRender, setFirstRender] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    const question = props.question;
    const data = question.getArrayValues({normalizeValue:false, writeDateInString:false});

    useEffect(() => {

      processColour();

      setTimeout(() => {
        setFirstRender(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      }, 200);
  
  }, [fadeAnim]);



  function processColour() {
    if(!data.length) {
      return;
    }

    const lLocation = [];
    const lLocationHUE = [];

    for(let i = 0; i < 12; i++) {
      const potentialText = 'hsl(0,0%,' + 10 * i + '%)';
      lLocation.push({y:0, x:i, label:"", colour:potentialText});
      lLocationHUE.push({y:0, x:i, label:""});
    }

    const addVal = 100 / data.length;

    for(let i in data) {
      const hsv = Utils.hexToHSL(data[i].value);
      const value = hsv.l / 100;
      const valueH = hsv.h / 360;
      let index = value;
      let indexH = valueH;
      index *= lLocation.length;
      indexH  *= lLocationHUE.length;
      index = Math.floor(index);
      indexH  = Math.floor(indexH);
      index = Math.min(index, lLocation.length - 1);
      indexH = Math.min(indexH, lLocationHUE.length - 1);
      lLocation[index].y += addVal;
      lLocationHUE[indexH].y += addVal;
    }

    setWidthBars(Dimensions.get('window').width * 0.5 / lLocation.length);
    lLocation.push({y:lLocation[lLocation.length - 1].y, x:lLocation.length})
    lLocation.push({y:lLocation[0].y, x:-1})
    setLocations(lLocation);
    setLocationsHUE(lLocationHUE);
  }

    function getColour(data) {
      return data.datum.colour;
    }
    
    function gradientHUE() {
      const lStops = [];
      for(let i = 0; i < 20; i++) {
        const hueAngle = i * 18;
        const offset = (i * 5) + "%";
        lStops.push(<Stop offset={offset} stopColor={"hsl(" + hueAngle + ",100%,75%)"} id={i}/>)
      }
      return lStops;
    }

    function getTickDisplay(x) {

        if(isNaN(x)) {
          return x;
        }
        else {
          return "";
        }
    }

    return(
    <View style={{marginTop:10, paddingRight:20, height:Dimensions.get('window').width * 1}}>

      <Text style={{textAlign:"center", color:"grey"}}>REPARTITION</Text>
      { firstRender && <Text>Loading...</Text> }
      { !firstRender && 
      <Animated.View // Special animatable View
      style={{
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
    <View style={{height:200}}>
     <VictoryChart
        domainPadding={{y:[0, 10]}}
        style={{height:200}}
        width={Dimensions.get('window').width * 0.98}
        height={Dimensions.get('window').width * 0.5}
      >
        <Text style={{textAlign:"left", marginLeft:"12%", marginTop:"5%", color:"grey"}}>shade</Text>
        <Defs>
          <LinearGradient id="brightnessStroke" >
            <Stop offset="0%" stopColor="#000" id="0"/>
            <Stop offset="100%" stopColor="#fff" id="1"/>
          </LinearGradient>
        </Defs>
        <VictoryArea
          data={locations}
          interpolation="natural"
          style={{
            data: { fill: 'url(#brightnessStroke)', width:widthBars, stroke: "black", strokeWidth: 2 }
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
      <View style={{height:200, marginTop:-30}}>
      <VictoryChart
        domainPadding={{y:[0, 10]}}
        style={{height:200}}
        width={Dimensions.get('window').width * 0.98}
        height={Dimensions.get('window').width * 0.5}
      >
        <Text style={{textAlign:"left", marginLeft:"12%", marginTop:"5%", color:"grey"}}>colour (hue)</Text>
        <Defs>
          <LinearGradient id="gradientHUE" >
            {gradientHUE()}
          </LinearGradient>
        </Defs>
        <VictoryArea
          data={locationsHUE}
          interpolation="natural"
          style={{
            data: { fill: 'url(#gradientHUE)', width:widthBars, stroke: "black", strokeWidth: 2 }
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
      </Animated.View>}
    </View>
    )
}

const styles = StyleSheet.create({
  
    valuesText: {
      fontSize:16,
      color:"black"
    },

});

export default RepartitionGraphColours;