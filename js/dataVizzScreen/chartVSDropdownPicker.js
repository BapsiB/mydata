import React, { useState, useCallback } from 'react';
import { View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import DataManager from '../dataManager.js';
import LinearGradient from 'react-native-linear-gradient';
import Utils from '../utils.js';

const ChartVsDropdownPicker = ({callback, excludeQuestionId}) => {

    const questions = DataManager.getQuestions();
    const pickerItems = [];
    for(i in questions) {
        const question = questions[i];
        if(question.id != excludeQuestionId) {
            pickerItems.push({label:question.text, value:question.id});
        }
    }

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(pickerItems);
    const [value, setValue] = useState(null);
    const [colourBackground, setColourBackground] = useState("transparent");

    const onChangeValue= (value) => {
        callback(value);
        if(value >= 0) {
            setColourBackground(DataManager.getQuestionWithId(value).colour);
        }
        else {
            setColourBackground("transparent");
        }
    }

    return (
        <View style={{flexDirection:'row'}}>
            <View style={{marginLeft:"7%", paddingTop:10}}>
                <LinearGradient
                start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                locations={[0,0.7]}
                colors={[colourBackground == "transparent" ? colourBackground : Utils.increase_brightness(colourBackground, 40), colourBackground]}
                style={{height:20, width:20, borderRadius:10}}>
                </LinearGradient>
            </View>
            <View>
                <DropDownPicker
                dropDownContainerStyle={{width:"80%", marginHorizontal:"10%"}}       
                textStyle={{height:20}}
                labelStyle={{height:30}}
                style={{width:"80%", marginHorizontal:"0%",  backgroundColor:"transparent", borderBottomColor:"transparent"}}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={onChangeValue}
                placeholder={"Evaluate with another chart..."}
                />
            </View>
        </View>
      );
}

export default ChartVsDropdownPicker;