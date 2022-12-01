import { PrivateValueStore } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { shadow } from 'react-native-paper';
import Draggable from 'react-native-draggable';

const { add } = Animated;

let widthView;

const MySlider = (props) => {
    const y = 0;
    let widthView = 0;
    const {height, step} = props;
    return (
        <View 
        style={styles.container}
        onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
          }}
        >
            <Animated.View
            style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor:"#0bb",
                borderRadius:35,
                height: "100%",
                width: 70
            }}
            >
                <Cursor size={70} heightParent={height} stepCounts={step}>

                </Cursor>
            </Animated.View>

        </View>
    )
};


const Cursor = (props) => {
    const {size, heightParent} = props;
    return (
        <Draggable
        maxX={size}
        minX={0}
        minY={0}
        maxY={heightParent}
        onDrag={(e) => console.log('drag')}
        >
            <View
                style={{
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
        </Draggable>
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