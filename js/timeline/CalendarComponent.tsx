import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CalendarList, AgendaSchedule } from 'react-native-calendars';
import HeaderDate from '../headerDate.js';
import DataManager from '../dataManager.js';

interface CalendarComponentProps {
    events: AgendaSchedule;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ events }) => {

    // const [currentDate, setCurrentDate] = React.useState(HeaderDate.getDate());
    const [selected, setSelected] = React.useState('');

    // Define the marking style for the highlighted day
    const markedDates = DataManager.getFilledDates();

    return (
        <View style={styles.viewContainer}>
            <CalendarList
                // Callback which gets executed when visible months change in scroll view. Default = undefined
                onVisibleMonthsChange={(months) => { console.log('now these months are visible', months); }}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={50}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={50}
                // Enable or disable scrolling of calendar list
                scrollEnabled={true}
                // Enable or disable vertical scroll indicator. Default = false
                showScrollIndicator={true}

                // Pass the markedDates prop to the Calendar component
                markedDates={markedDates}

                // Custom day component to control the text color of selected day
                dayComponent={({ date, state }) => {
                    const isSelected = date.dateString === selected;
                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: state === 'disabled' ? 'gray' : 'black',
                                    backgroundColor: isSelected ? '#bee' : 'transparent',
                                    padding: 10,
                                    borderRadius: 20,
                                    width: 40
                                }}
                                onPress={() => {
                                    setSelected(date.dateString);
                                    let lDate = new Date(date.year, date.month - 1, date.day);
                                    HeaderDate.setDate(lDate);
                                }
                                }
                            >
                                {date.day}
                            </Text>
                        </View>
                    );
                }}


                onDayPress={(date: DateData) => {
                    let lDate = new Date(date.year, date.month - 1, date.day);
                    HeaderDate.setDate(lDate);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
    },
    knob: {
        height: 8,
        width: 80,
        backgroundColor: 'blue',
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 10,
    },
    viewContainer: {
        backgroundColor: 'blue',
        flex: 1
    }
});

export default CalendarComponent;
