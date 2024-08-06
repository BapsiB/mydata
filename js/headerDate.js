import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, Dimensions, Animated } from 'react-native';
import SharedConstants from './sharedConstants.js';
import Utils from './utils'
import CalendarComponent from './timeline/CalendarComponent';

class HeaderDate {

    constructor() {
    this.date = new Date();
    const that = this;
    this.changeCallbacks = [];
    this.navigation = null;

    this.getDate = function() {
        return this.date;
    }
        
    this.setNavigation = function() {
        return this.date;
    }

    this.addChangeCallback = function(id, callback) {
        this.changeCallbacks[id] = callback;
    }

    this.setDate = function(date) {
        this.date = date;

        if (that.updateComponentDate) {
            that.updateComponentDate(date);
        }

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

        this.getHeader = function () {
        
            const { height } = Dimensions.get('window');

            const [currentDate, setCurrentDate] = React.useState(that.getDate());
            const [calendarVisible, setCalendarVisible] = useState(false);
            const slideAnim = useRef(new Animated.Value(-height)).current;


            if (SharedConstants.getDateString(currentDate) != SharedConstants.getDateString(that.getDate())) {
                setCurrentDate(that.getDate());
            }

            const setDate = function(date) {
                that.setDate(date);
                setCurrentDate(date);
            }

            that.updateComponentDate = function(date) {
                setCurrentDate(date);
            }

            function showModal() {
                if (calendarVisible) {
                // Slide up
                Animated.timing(slideAnim, {
                    toValue: -height,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setCalendarVisible(false);
                });
                } else {
                setCalendarVisible(true);
                // Slide down
                Animated.timing(slideAnim, {
                    toValue: 60,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
                }
            }

            return (
            <View style={{height:calendarVisible ? "100%" : 60, position: "absolute", width: "100%", zIndex: 3}}>
                <View style={{height: 60, marginLeft: "0%", width: "100%", flexDirection: "row", marginVertical: 0, marginBottom: 0, elevation: 3, backgroundColor:Utils.increase_brightness(SharedConstants.coloursTheme.colourBrightOne, 60), zIndex: 3 }}>
                    <View style={{ flex: 1, marginLeft: 0 }}>
                        <TouchableOpacity style={{ height: 60, paddingTop: 20 }} onPress={() => { setDate(incrementDate(this.date, -1)); }}>
                            <Text style={styles.dateText}>{"<"}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{flex: 10}} onPress={() => { showModal(); }}>
                        <View style={{ marginRight: -20, height: 60, paddingTop: 20 }}>
                            <Text style={styles.dateText}>{SharedConstants.getDateString(that.date)}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={{ height: 60, paddingTop: 20, marginLeft: 0}} onPress={() => { setDate(incrementDate(this.date, 1)); }}>
                            {/* <Image style={{ width:30, height:30,  resizeMode: 'stretch' }} source={require("../resources/arrowR.png")}/> */}
                            <Text style={styles.dateText}>{">"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                calendarVisible && (
                <Animated.View
                    style={{
                    position: 'absolute',
                    height: height - 45,
                            marginTop: 0,
                    zIndex:-10,
                    transform: [{ translateY: slideAnim }],
                    }}
                >
                    <CalendarComponent headerDate={that} currentDate={currentDate} />
                </Animated.View>
                )
                }
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