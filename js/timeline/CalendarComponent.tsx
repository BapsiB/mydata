import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CalendarList, AgendaSchedule } from 'react-native-calendars';
import DataManager from '../dataManager';

interface CalendarComponentProps {
    headerDate: {
        getDate: () => Date;
        addChangeCallback: (id: string, callback: () => void) => void;
    };
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ headerDate }) => {
    const [selected, setSelected] = useState('');
    const [datesState, setDatesState] = useState<Record<string, { filled: boolean }>>({}); // Assuming DateState has a 'filled' property

    // Fetch filled dates only once when the component mounts
    useEffect(() => {
        const filledDates = DataManager.getFilledDates();
        setDatesState(filledDates);
    }, []);

    const dateChange = useCallback(() => {
        const newDateStr = headerDate.getDate().toISOString().split('T')[0];
        setSelected(newDateStr);
    }, [headerDate]);

    useEffect(() => {
        headerDate.addChangeCallback("CalendarComponent", dateChange);
        // Clean up the callback when the component unmounts
        return () => {
            // Assuming there's a method to remove the callback
            // headerDate.removeChangeCallback("CalendarComponent");
        };
    }, [headerDate, dateChange]);

    const dayComponent = useCallback(({ date, state }: { date: { dateString: string; day: number }; state: 'selected' | 'disabled' | 'today' }) => {
        const isSelected = date.dateString === selected;
        const isFilled = datesState[date.dateString]?.filled;

        return (
            <TouchableOpacity onPress={() => setSelected(date.dateString)} style={styles.dayContainer}>
                <View style={[styles.dayContent, isSelected && styles.selectedDay]}>
                    <Text
                        style={[
                            styles.dayText,
                            {
                                color: isSelected ? 'white' : state === 'disabled' ? 'gray' : 'black',
                            }
                        ]}
                    >
                        {date.day}
                    </Text>
                    {isFilled && <View style={styles.dot} />}
                </View>
            </TouchableOpacity>
        );
    }, [selected, datesState]);

    const calendarTheme = useMemo(() => ({
        dotColor: 'red',
        todayTextColor: 'red',
        dayTextColor: 'black',
        textDisabledColor: 'gray',
    }), []);

    return (
        <View style={styles.container}>
            <CalendarList
                onVisibleMonthsChange={(months) => { console.log('now these months are visible', months); }}
                pastScrollRange={50}
                futureScrollRange={50}
                scrollEnabled={true}
                showScrollIndicator={true}
                theme={calendarTheme}
                dayComponent={dayComponent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
    },
    dayContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        position: 'relative',
    },
    dayText: {
        textAlign: 'center',
        fontSize: 16,
    },
    selectedDay: {
        backgroundColor: '#bee',
        borderRadius: 16,
    },
    dot: {
        position: 'absolute',
        bottom: 0,
        width: 4,
        height: 4,
        borderRadius: 3,
        backgroundColor: 'green',
    },
});

export default CalendarComponent;