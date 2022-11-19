import { PrivateValueStore } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { shadow } from 'react-native-paper';

const { add } = Animated;

let widthView, heightView;

const MySlider = (props) => {
    const y = 0;
    let widthView = 0;
    let heightView = 0;
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
                backgroundColor:"#bbb",
                borderRadius:widthView/2,
                height:add(y, widthView),
            }}
            />

        </View>
    )
};

/*  */
// <Cursor size={widthView}/>
// const Cursor = (props) => {
//     const {size} = props;
//     return (
//         <Animated.View
//             style={{
//                 width:size,
//                 height:size,
//                 borderRadius:size / 2,
//                 backgroundColor:"white",
//                 shadowColor:"#000",
//                 shadowOffset: {
//                     width: 2,
//                     height: 0,
//                 },
//                 shadowOpacity:0.25,
//                 shadowRadius:3.84,
//                 elevation:5
//             }}
//         />
//     )
// };

const styles = StyleSheet.create({
    constainer:{
        width:30,
        height:heightView,
        borderRadius : 10,
        backgroundColor:"#eee"

    }
});

export default MySlider;