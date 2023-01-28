import { PrivateValueStore } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { shadow } from 'react-native-paper';
import Draggable from 'react-native-draggable';
import sharedConstants from '../sharedConstants';

const { add } = Animated;

let widthView;

const MySlider = (props) => {
    const y = 0;
    let widthView = 0;
    const sizeKnob = 70;
    const {height, step, value, minimumValue, maximumValue, onSlidingComplete, onValueChanged, trackColour} = props;

    const pan = useRef(
        new Animated.ValueXY({ x: 0, y: 0 })
      ).current;

    useEffect(() => {
        updatePanValue(value); // this will fire only on first render
    }, []);

      const updatePanValue = (aValue) => {
        aValue = (-aValue + maximumValue) - minimumValue;
        const TopShouldBe = aValue * (height - sizeKnob) / (step - 1);
        pan.setValue({x:0, y:TopShouldBe})
      }

      const getCurrentDataValueFromPosition = () => {
        const currentStepValue = step * (pan.y._value + pan.y._offset) / (height - sizeKnob);
        const currentValue = Math.min(step - 1, Math.floor(currentStepValue));

        const currentValueConsideringMinMax = minimumValue + (maximumValue - currentValue);
        return currentValueConsideringMinMax;
      }

      const panResponder = useRef(
        PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            pan.setOffset({
              x: pan.x._value,
              y: pan.y._value
            });
          },
          onPanResponderMove: (e, gestureState) => {
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
    
    if(isNaN(pan.y._value)) {
      return(<View/>)
    }
    return (
        <View 
        style={styles.container}
        >
            <View

            style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor:trackColour,
                borderRadius:35,
                height: "100%",
                width: sizeKnob
            }}
            >
                <Animated.View 
                    size={sizeKnob} 
                    heightParent={height} 
                    stepCounts={step}
                    style={{
                        position:"absolute",
                        top: pan.y,
                        width:sizeKnob,
                        height:sizeKnob,
                        borderRadius:sizeKnob / 2,
                        backgroundColor:"white",
                        shadowColor:"#000",
                        shadowOffset: {
                            width: 2,
                            height: 0,
                        },
                        shadowOpacity:0.25,
                        shadowRadius:3.84,
                        elevation:5
                    }}
                    {...panResponder.panHandlers}
                >
                </Animated.View>
            </View>

        </View>
    )
};


const Cursor = (props) => {
    let {size, heightParent, position} = props;
    return (
        <View>
            <View
                style={{
                    top: position,
                    width:size,
                    height:size,
                    borderRadius:size / 2,
                    backgroundColor:"white",
                    shadowColor:"#000",
                    shadowOffset: {
                        width: 2,
                        height: 0,
                    },
                    shadowOpacity:0.25,
                    shadowRadius:3.84,
                    elevation:5
                }}
            >
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        width:30,
        height: "100%",
        borderRadius : 10,
        backgroundColor:"#eee"

    }
});

export default MySlider;