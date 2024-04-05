import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import HeaderDate from '../headerDate.js';

class AnswerYesNo extends React.Component {

    constructor(props) {
        super();
        this.question = props.question;

        this.state = {answer: DataManager.getAnswerForQuestion(this.question.id, HeaderDate.getDate())};
        // const forceUpdate = React.useReducer(() => ({}))[1]

        // function dateChanged() {
        //  forceUpdate();
        // }

        // HeaderDate.addChangeCallback("AnswerYesNo",dateChanged);

        this.onPress = function(isYes) {
            const lAnswer = isYes ? 1 : 0;
            DataManager.setData(this.question.id, HeaderDate.getDate(), lAnswer);
            this.setState({answer: lAnswer});
            props.callback(true);
        }

        this.onPressRemoveData = function() {
            DataManager.removeData(this.question.id, HeaderDate.getDate());
            this.setState({answer: -1});
            props.callback();
        }

        this.getStyle = function(isSelected) {
            return isSelected ? styles.yesNoButtonsSelected : styles.yesNoButtons;
        }
    }
    
    render(){
        const answer = DataManager.getAnswerForQuestion(this.question.id, HeaderDate.getDate());
        return (
            <View style={{margin: 50, flexDirection: "column", justifyContent: 'center'}}>
                <View style={{margin: 50, flexDirection: "row", justifyContent: 'center'}}>
                    <TouchableOpacity style={[SharedConstants.styles.BaseButtons, this.getStyle(answer == 1)]} onPress={()=>{this.onPress(true);}}>
                        <Text style={[SharedConstants.styles.textButton, {color:"black"}]}>YES</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[SharedConstants.styles.BaseButtons, this.getStyle(answer == 0)]} onPress={()=>{this.onPress(false);}}>
                        <Text style={[SharedConstants.styles.textButton, {color:"black"}]}>NO</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{justifyContent: 'center', alignItems:'center', height:50, marginVertical:-20 }} onPress={()=>{this.onPressRemoveData();}}>
                    <Text style={[SharedConstants.styles.textButton, {color:"black", textDecorationLine: 'underline'}]}>I DON'T KNOW</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    yesNoButtons: {
        margin:20,
        height: 70,
        width: 130,
    },

    yesNoButtonsSelected: {
        margin:20,
        height:70,
        backgroundColor: "#eef",
        width:130
    },
 });

export default AnswerYesNo;