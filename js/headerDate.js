import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SharedConstants from './sharedConstants.js';

class HeaderDate {
//const HeaderDate = (props) => {
    constructor() {
    this.date = new Date();
    const that = this;

    this.getDate = function() {
        return this.date;
    }

    this.setDate = function(date) {
        this.date = date;
    }

    function setDate(date) {
        that.setDate(date);
    }

   function incrementDate(dateInput,increment) {
       var dateFormatTotime = new Date(dateInput);
       var increasedDate = new Date(dateFormatTotime.getTime() +(increment *86400000));
       return increasedDate;
   }

    this.getHeader = function() {
        const [currentDate, setCurrentDate] = React.useState(that.getDate());

        if(SharedConstants.getDateString(currentDate) != SharedConstants.getDateString(that.getDate())) {
            setCurrentDate(that.getDate());
        }

        function setDate(date) {
            that.setDate(date);
            setCurrentDate(date);
        }

        return (
            <View style={{height:40, flexDirection: "row", marginVertical:20,}}>
                <View style={{flex:1, marginLeft:20}}>
                    <TouchableOpacity onPress={()=>{setDate(incrementDate(this.date, -1));}}>
                      <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowLeft.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 12}}>
                    <Text style={styles.dateText}>{SharedConstants.getDateString(that.date)}</Text>
                </View>
                <View style={{flex:1}}>
                    <TouchableOpacity onPress={()=>{setDate(incrementDate(this.date, 1));}}>
                      <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowRight.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, marginRight:10}}>
                    <TouchableOpacity style={styles.button_footer} onPress={()=>{setDate(this.date);}}>
                      <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowDoubleRight.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    }
}


const styles = StyleSheet.create({
        dateText: {
            color: 'black',
            fontSize: 20,
            fontWeight: '500',
            textAlignVertical:'center',
            textAlign:'center',
        },
 });

export default new HeaderDate();