import { StyleSheet, Text, View, TouchableOpacity, ScrollView, PanResponder, Animated } from 'react-native';
import React, { useRef } from 'react';
import DataManager from '../dataManager';

const TimeLineView = () => {

    const heightLine = 1200;
    const height = heightLine;
    const sizeKnob = 30;
    let step;

    const pan = useRef(
        new Animated.ValueXY({ x: 0, y: 0 })
      ).current;

    const panResponder = useRef(
        PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            pan.setOffset({
              x: pan.x._value,
              y: pan.y._value
            });
          },
          onPanResponderMove: (e:any, gestureState:any) => {
            const lOffset = pan.y._offset;
            pan.setValue({x:gestureState.dx, y:Math.max(-lOffset, Math.min(height - lOffset - sizeKnob, gestureState.dy))});

            const currentStepValue = step * (pan.y._value + pan.y._offset) / (height - sizeKnob);

            onValueChanged(getCurrentDataValueFromPosition())
            
          },
          onPanResponderRelease: () => {
            pan.flattenOffset();
            const currentValueConsideringMinMax = getCurrentDataValueFromPosition();
            
            updatePanValue(currentValueConsideringMinMax);
            onSlidingComplete(currentValueConsideringMinMax)
          }
        })
      ).current;
    
    const getTimeMarkers = () => {
        const markersList = [];
        const allData = DataManager.getAllData()
        for(let i = 0; i < allData.length; i++) {
            const top = heightLine * i / allData.length;
            markersList.push(<View key={i} style={{height:2, width:10, position:"absolute", top:top, backgroundColor:"#ccf", marginLeft:15}}></View>)
        }
        step = markersList.length;
        return markersList;
    }

    const getMainLine = () => {
        return (
            // <ScrollView style={{height:"100%", width:"100%"}}>
                <View style={{flexDirection:"row", height:"100%", width:"100%"}}>
                    {getTimeMarkers()}
                    <View style={{width:10, backgroundColor:"#ccf", height:heightLine, borderRadius:5, marginLeft:10}}/>
                    <Animated.View 
                    style={{position:"absolute", top: pan.y, width:sizeKnob, height:sizeKnob, borderWidth:3, borderColor:"#ccf", backgroundColor:"#fff", borderRadius:sizeKnob * 0.5}} 
                    {...panResponder.panHandlers}/>
                </View>
            // </ScrollView>
        )
    }

    return(
        <View style={styles.mainView}>
            {getMainLine()}
        </View>
    )
}

const styles = StyleSheet.create({
    mainView:{
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
    },
});

export default TimeLineView;