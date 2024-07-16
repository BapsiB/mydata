import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import SharedConstants from './sharedConstants.js';
import CalendarComponent from './timeline/CalendarComponent';
import { Background } from 'victory-native';

class HeaderDate {

    constructor() {
    this.date = new Date();
    const that = this;
    this.changeCallbacks = [];

    this.getDate = function() {
        return this.date;
    }

    this.addChangeCallback = function(id, callback) {
        this.changeCallbacks[id] = callback;
    }

    this.setDate = function(date) {
        this.date = date;
        for (let i in this.changeCallbacks) {
            this.changeCallbacks[i]();
        }
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
        const [calendarVisible, setCalendarVisible] = useState(false);

        if(SharedConstants.getDateString(currentDate) != SharedConstants.getDateString(that.getDate())) {
            setCurrentDate(that.getDate());
        }

        function setDate(date) {
            that.setDate(date);
            setCurrentDate(date);
        }

        function showModal() {
            setCalendarVisible(true)
        }

        return (
            <View style={{ position: "absolute", height: 45, width: "90%", marginLeft: "5%", flexDirection: "row", marginVertical: 0, marginBottom: 0, elevation: 3, zIndex: 3 }}>
                <View style={{flex:1, marginLeft:0}}>
                    <TouchableOpacity style={{width:50, height:60, paddingTop:20}} onPress={()=>{setDate(incrementDate(this.date, -1));}}>
                        <Text style={styles.dateText}>{"<"}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { showModal(); }}>
                <View style={{ flex: 10, marginRight:-20, height:60, paddingTop:20}}>
                    <Text style={styles.dateText}>{SharedConstants.getDateString(that.date)}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flex:1}}>
                    <TouchableOpacity style={{width:50, height:60, paddingLeft:20, paddingTop:20, marginLeft:-15}} onPress={()=>{setDate(incrementDate(this.date, 1));}}>
                        {/* <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowR.png")}/> */}
                        <Text style={styles.dateText}></Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent={true}
                    visible={calendarVisible}
                    animationType="slide"
                >
                    <View style={{ flex:1 }}>
                        <CalendarComponent></CalendarComponent>    
                    </View>
                    
                </Modal>
            </View>
        );
    }

    }
}


const styles = StyleSheet.create({
        dateText: {
            color: 'black',
            fontSize: 16,
            fontWeight: '500',
            textAlignVertical:'center',
            textAlign: 'center',
            fontFamily: 'Montserrat-Regular'
        },
 });

export default new HeaderDate();