import React, {useEffect, useState, useRef} from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
import ChartVsDropdownPicker from './chartVSDropdownPicker.js'
import { VictoryArea, VictoryLabel, VictoryScatter, VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer } from "victory-native";
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import DataManager from '../dataManager.js';
import SharedConstants from '../sharedConstants.js';
import HeaderDate from '../headerDate.js';

const QuestionButtonViz = (props) => {

  const question = DataManager.getQuestionWithId(props.questionId);
  const data = question.getArrayValues({ normalizeValue: true, writeDateInString: false, daysCount: 10, upToDay:HeaderDate.getDate() });
  // data.push({ value: -0.5, date: -1 });
  // for (let i = 0; i < 10; i++) {
  //   data.push({ value: i / 15, date: i });
  // }
  
  if (data.length < 2) {
    return null;
  }

  if (question.type == SharedConstants.questionTypes.QUESTION_TYPE_COLOUR) {
    return null;
      transformDataForColours();
    }

  // Sort the data by date
  const sortedData = data.sort((a, b) => a.date - b.date);

  // Helper function to calculate the control points for a smooth curve
  const controlPoint = (current, previous, next, reverse) => {
    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current;
    const n = next || current;
    // The smoothing ratio
    const smoothing = 0.2;
    // Properties of the opposed-line
    const o = line(p, n);
    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    // The control point position is relative to the current point
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return { x, y };
  };

  // Helper function to calculate the properties of the line between two points
  const line = (pointA, pointB) => {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };

  // Create the 'd' attribute for the SVG path
  const makePath = (dataPoints) => {
    let pathD = `M ${dataPoints[0].x},${dataPoints[0].y}`;
    dataPoints.slice(1).forEach((point, i, arr) => {
      const { x, y } = point;
      const prevPoint = dataPoints[i];
      const nextPoint = arr[i + 1] || point;
      const cps = controlPoint(prevPoint, dataPoints[i - 1], point);
      const cpe = controlPoint(point, prevPoint, nextPoint, true);
      pathD += `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${x},${y}`;
    });
    return pathD;
  };

  // Convert the sorted data into a list of points with normalized coordinates
  const points = sortedData.map((point, i) => ({
    x: i * (300 / (sortedData.length - 1)),
    y: 100 - point.value * 100,
  }));

  const pathData = makePath(points);
  const closedPathData = `${pathData} L ${points[points.length - 1].x},100 L 0,100 Z`;

  return (
    <View style={[styles.container, {zIndex: 1, height:70, width:70, transform: [{translateY: -20}, {translateX: -100}, {scale:0.5}]}]}>

    <Svg height="200" width="300" viewBox="0 0 300 100">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          {/* Use RGBA colors for gradient stops with alpha channel for opacity */}
          <Stop offset="0%" stopColor={question.colour} stopOpacity="0.1" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={closedPathData} fill="url(#grad)" />
      <Path d={pathData} fill="none" stroke="#ddd" strokeWidth="2" />
      </Svg>
      </View>
  );
};



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