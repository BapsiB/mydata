import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import DataManager from '../dataManager';

interface CalendarComponentProps {
    headerDate: {
        getDate: () => Date;
        setDate: (date: Date) => void;
        addChangeCallback: (id: string, callback: () => void) => void;
    };
}

type MarkedDates = {
    [date: string]: {
        marked?: boolean;
        dotColor?: string;
        selected?: boolean;
        selectedColor?: string;
        disabled?: boolean;
        disableTouchEvent?: boolean;
    }
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ headerDate }) => {
    const [currentMonth, setCurrentMonth] = useState(headerDate.getDate());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [filledDates, setFilledDates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const dates = DataManager.getFilledDates();
        setFilledDates(Object.fromEntries(
            Object.entries(dates).map(([date, { filled }]) => [date, filled])
        ));
    }, []);

    const markedDates = useMemo(() => {
        const marked: MarkedDates = {};
        Object.entries(filledDates).forEach(([date, filled]) => {
            if (filled) {
                marked[date] = { marked: true, dotColor: 'green' };
            }
        });
        if (selectedDate) {
            marked[selectedDate] = {
                ...marked[selectedDate],
                selected: true,
                selectedColor: "#bee"
            };
        }
        return marked;
    }, [filledDates, selectedDate]);

    const dateChange = useCallback(() => {
        const date = headerDate.getDate();
        const str = date.toISOString().split('T')[0];
        setSelectedDate(str);
        setCurrentMonth(date);
    }, [headerDate]);

    useEffect(() => {
        headerDate.addChangeCallback("CalendarComponent", dateChange);
        return () => {
            headerDate.addChangeCallback("CalendarComponent", () => { });
        };
    }, [headerDate, dateChange]);

    const handleDayPress = useCallback((day: DateData) => {
        setSelectedDate(day.dateString);
        headerDate.setDate(new Date(day.dateString));
    }, [headerDate]);

    const calendarTheme = useMemo(() => ({
        todayTextColor: 'red',
        selectedDayBackgroundColor: '#b00',
        selectedDayTextColor: 'black',
        dotColor: 'blue',
        selectedDotColor: 'blue',
    }), []);

    return (
        <View style={styles.container}>
            <CalendarList
                current={currentMonth.toISOString()}
                onVisibleMonthsChange={(months) => {
                    if (months.length > 0) {
                        setCurrentMonth(new Date(months[0].dateString));
                    }
                }}
                theme={calendarTheme}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                pastScrollRange={50}
                futureScrollRange={50}
                scrollEnabled={true}
                showScrollIndicator={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default React.memo(CalendarComponent);