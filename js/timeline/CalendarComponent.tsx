
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import DataManager from '../dataManager';

interface CalendarComponentProps {
    headerDate: {
        getDate: () => Date;
        addChangeCallback: (id: string, callback: () => void) => void;
    };
}

const MemoizedDayComponent = React.memo(({ date, state, onPress, isSelected, isFilled }: {
    date: { dateString: string; day: number };
    state: 'selected' | 'disabled' | 'today';
    onPress: () => void;
    isSelected: boolean;
    isFilled: boolean;
}) => (
    <TouchableOpacity onPress={onPress} style={styles.dayContainer}>
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
));

const CalendarComponent: React.FC<CalendarComponentProps> = ({ headerDate }) => {
    const [selected, setSelected] = useState('');
    const [datesState, setDatesState] = useState<Record<string, { filled: boolean }>>({});

    useEffect(() => {
        const filledDates = DataManager.getFilledDates();
        setDatesState(filledDates);
        updateSelected();
    }, []);

    const updateSelected = () => {
        const date = headerDate.getDate();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const str = `${year}-${month}-${day}`;
        setSelected(str);
    }

    const dateChange = useCallback(() => {
        updateSelected();
    }, [headerDate]);

    useEffect(() => {
        headerDate.addChangeCallback("CalendarComponent", dateChange);
        return () => {
            // Cleanup logic here if needed
        };
    }, [headerDate, dateChange]);

    const markedDates = useMemo(() => {
        const marked: Record<string, { selected: boolean; filled: boolean }> = {};
        Object.keys(datesState).forEach(date => {
            marked[date] = { selected: date === selected, filled: datesState[date].filled };
        });
        return marked;
    }, [datesState, selected]);

    const renderDay = useCallback(({ date, state }: { date: { dateString: string; day: number }; state: 'selected' | 'disabled' | 'today' }) => {
        const isSelected = date.dateString === selected;
        const isFilled = datesState[date.dateString]?.filled;

        return (
            <MemoizedDayComponent
                date={date}
                state={state}
                onPress={() => {
                    let lDate = new Date(date.year, date.month - 1, date.day);
                    headerDate.setDate(lDate);
                    // setSelected(date.dateString);
                }}
                isSelected={isSelected}
                isFilled={isFilled}
            />
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
                dayComponent={renderDay}
                markedDates={markedDates}
                onDayPress={(date) => {
                    let lDate = new Date(date.year, date.month - 1, date.day);
                    headerDate.setDate(lDate);
                    // setSelected(date.dateString);
                }}
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

export default React.memo(CalendarComponent);