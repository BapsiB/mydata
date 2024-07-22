import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import DataManager from '../dataManager.tsx';
import LinearGradient from 'react-native-linear-gradient';
import Utils from '../utils.js';

const ChartVsDropdownPicker = ({callback, excludeQuestionId}) => {

    const questions = DataManager.getQuestions();
    const pickerItems = [];
    for(let i in questions) {
        const question = questions[i];
        if(question.id != excludeQuestionId) {
            pickerItems.push({label:question.text, value:question.id});
        }
    }
    pickerItems.push({label:"none", value:-1});

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(pickerItems);
    const [value, setValue] = useState(null);
    const [colourBackground, setColourBackground] = useState("#ffffff");

    const onChangeValue= (value) => {
        callback(value);
        if(value >= 0) {
            setColourBackground(DataManager.getQuestionWithId(value).colour);
        }
        else {
            setColourBackground("#ffffff");
        }
    }

    function getStyleButton() {
        if(value === null || value < 0) {
            return ({
                backgroundColor:"transparent", 
                borderBottomColor:"transparent"
            })
        }
        else {
            return ({
                backgroundColor:"transparent", 
                borderBottomColor:"transparent"
            })
        }

    }

    return (
        <View style={{flexDirection:'row', height:30}}>
            <View style={{marginLeft:"7%", paddingTop:10, marginTop:-30, height:20, width:20, borderRadius:10,}}>
                <LinearGradient
                start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                locations={[0,0.7]}
                colors={[colourBackground == "transparent" ? colourBackground : Utils.increase_brightness(colourBackground, 40), colourBackground]}
                style={styles.circleButton}>
                </LinearGradient>
            </View>
            <View>
                <DropDownPicker
                dropDownContainerStyle={{width:"50%", marginHorizontal:"0%", marginTop:-30}}       
                textStyle={{height:20}}
                labelStyle={{height:30}}
                style={[{width:"80%", marginHorizontal:"0%", marginTop:-30, zIndex: 10,  }, getStyleButton()]}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={onChangeValue}
                placeholder={"Add a chart..."}
                />
            </View>
        </View>
      );
}

const styles = StyleSheet.create({
    circleButton: {
        height:20,
        width:20,
        borderRadius:10,

        elevation: 1,
    }
})

export default ChartVsDropdownPicker;