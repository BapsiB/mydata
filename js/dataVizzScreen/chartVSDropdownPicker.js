import React, { useState, useCallback } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import DataManager from '../dataManager.js';

const ChartVsDropdownPicker = (props) => {

    const questions = DataManager.getQuestions();
    const pickerItems = [];
    for(i in questions) {
        const question = questions[i];
        pickerItems.push({label:question.text, value:question.id});
    }

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(pickerItems);
    const [value, setValue] = useState(null);

    const onChangeValue= (value) => {
        props.callback(value);
    }

    return (
        <DropDownPicker
        style={{width:"80%", marginHorizontal:"10%", backgroundColor:"transparent", borderTopColor:"transparent"}}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={onChangeValue}
        placeholder={"Evaluate with another chart..."}
        />
      );
}

export default ChartVsDropdownPicker;