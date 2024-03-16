import React, {useEffect, useState, useRef} from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
import ChartVsDropdownPicker from './chartVSDropdownPicker.js'
import { VictoryArea, VictoryLabel, VictoryScatter, VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import {Defs, LinearGradient, Stop} from "react-native-svg";
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';
import HeaderDate from '../headerDate.js';

const QuestionButtonViz = (props) => {

  const question = DataManager.getQuestionWithId(props.questionId);
  const data = question.getArrayValues({ normalizeValue: false, writeDateInString: false, daysCount: 10, upToDay:HeaderDate.getDate() });
  // data.push({ value: -0.5, date: -1 });
  // for (let i = 0; i < 10; i++) {
  //   data.push({ value: i / 15, date: i });
  // }
  
  if (!data.length) {
    return null;
  }

  if (question.type == SharedConstants.questionTypes.QUESTION_TYPE_COLOUR) {
    return null;
      transformDataForColours();
    }

    const [firstRender, setFirstRender] = useState(true);
    const [dataAv, setDataAv] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
      setTimeout(() => {
        // setFirstRender(false);

        // Animated.timing(fadeAnim, {
        //   toValue: 1,
        //   duration: 500,
        //   useNativeDriver: true,
        // }).start();

      }, 100);
    }, [fadeAnim]);

    function transformDataForColours() {
      data = [];
      for(let i in props.data) {
        data[i] = {
          colour:props.data[i].value, 
          date:props.data[i].date, 
          value:1};
      }
    }

    const renderVictoryLines = () => {
      let id = 0;
      
      const colour = question.getColour() ? question.getColour() : "#c43a31";
      const type = (question.type == SharedConstants.questionTypes.QUESTION_TYPE_YES_NO) ? "step" : "natural";
      dataStyle = { fill: 'url(#gradientStroke)', fillOpacity: 0.5, strokeOpacity:0.5, stroke: colour, strokeWidth: 10 }
        // dataStyle = { fill: colour, fillOpacity: 1, stroke: colour, strokeWidth: 1 }
      return <VictoryArea interpolation={type} key={id} data={data} x="date" y="value" style={{ data:dataStyle  }}/>;
    }


  function getStringDate(ms) {
    // date.toString();
    const date = new Date(ms);
    return date.toLocaleString('en-us',{day:'2-digit', month:'short'})
  }

  function getTickValues() {
    return [];
    switch(question.type) {
      case SharedConstants.questionTypes.QUESTION_TYPE_YES_NO:
        return [0, 1];
      case SharedConstants.questionTypes.QUESTION_TYPE_INTENSITY:
        return [0, 25, 75, 100];
      case SharedConstants.questionTypes.QUESTION_TYPE_NUMBER:
        return [+question.options.min, +question.options.max];
    }
  }

  return (
    
    <View style={[styles.container, {zIndex: 1, height:70, width:70, transform: [{translateY: -20}, {translateX: -50}, {scale:0.2}]}]}>
    
    <VictoryChart  
              // domain={{ y: [question.getMin(), question.getMax() * 1.05] }}
        // width={140}
        // height={140}
    // theme={VictoryTheme.material}   

    >
    <Defs>
      <LinearGradient x1="50%" y1="0%" x2="50%" y2="80%" id="gradientStroke" >
        <Stop offset="0%" stopColor={question.getColour()}/>
        <Stop offset="100%" stopColor={'#ffffff00'}/>
      </LinearGradient>
    </Defs>
   <VictoryAxis style={{ 
    axis: {stroke: "transparent"}, 
    ticks: {stroke: "transparent"},
    tickLabels: { fill:"transparent"} 
}} />
      {renderVictoryLines()}
    </VictoryChart>
    </View>
  )
    
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    borderColor:"grey",
    // backgroundColor:"#ddddddff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 0,


    // justifyContent: "center",
    // alignItems: "center",
  },
})

function increase_brightness(hex, percent){
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if(hex.length == 3){
      hex = hex.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

  return '#' +
     ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}


export default QuestionButtonViz;