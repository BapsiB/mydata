import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, {useState} from "react";
import SharedConstants from '../sharedConstants.js';

const QuestionColour = ({onChange, initColour}) => {
  const [displayColourWheel, setDisplayColourWheel] = useState(false);
  
  function onColourSelect(colour) {
    onChange(colour);
  }

  const windowWidth = Dimensions.get('window').width;
  const widthRow = windowWidth;
  const marginTile = 10;
  const widthTile = (windowWidth - 6 * marginTile) / 5;
  const heightTile = widthTile * 0.7;
  const heightRow = heightTile;

  return (
    <View style={{flex: 3}}>
    <TouchableOpacity style={[styles.button_colour]} onPress={()=>{setDisplayColourWheel(!displayColourWheel);}}>
      <View style={{ width:50, height:50,  borderRadius:25, backgroundColor:initColour,  }} source={require("../../resources/arrowL.png")}/>
    </TouchableOpacity>

    <View style={{flexDirection:"column", alignItems:"center", height:heightRow * 2}}>
      <View style={{flexDirection:"row", height:heightRow, margin:marginTile}}>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[0]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[1]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[2]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[3]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[4]}/>
      </View>
      <View style={{flexDirection:"row", height:heightRow, margin:marginTile}}>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[5]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[6]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[7]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[8]}/>
        <QuestionColourSample onClick={onColourSelect} colour={SharedConstants.coloursSet[9]}/>
      </View>
    </View>
    </View>
  );
}

const QuestionColourSample = ({onClick, colour}) => {
  
  return (
    <TouchableOpacity onPress={()=>{onClick(colour);}}>
      <View style={[styles.colourSample, {backgroundColor:colour}]}></View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
    colourSample: {
        height:"100%",
        width:"80%",
        borderRadius:10,
        borderColor:"grey",
        marginHorizontal:"10%",
        marginTop:"-5%"
      },

    button_colour: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginBottom: 20,
      },
    
})
    
export default QuestionColour;