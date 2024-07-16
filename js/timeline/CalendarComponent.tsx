import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CalendarList, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import HeaderDate from '../headerDate.js';

interface CalendarComponentProps {
    events: AgendaSchedule;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ events }) => {
    const renderItem = (item: AgendaEntry, firstItemInDay: boolean) => {
        return (
            <View style={styles.item}>
                <Text>{item.name}</Text>
            </View>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is an empty date!</Text>
            </View>
        );
    };

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

                onDayPress={(date: DateData) => {
                    console.log("hello")
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
