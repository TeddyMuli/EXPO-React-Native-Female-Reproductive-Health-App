import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { CalendarList } from 'react-native-calendars';

const PeriodCalendar = ({ onDayPress, markedDates, periods } : { onDayPress: any, markedDates: any, periods: any }) => {

  const parseDates = (periods: any) => {
    const parsedDates: any = {};

    periods?.forEach((period: any) => {
      let startDate = new Date(period.start_date);
      let endDate = new Date(period.end_date);

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate: string = date.toISOString().split('T')[0];
        if (!parsedDates[formattedDate]) { // Prevent overlapping conflicts
          parsedDates[formattedDate] = {
            selected: true,
            marked: true,
            selectedColor: '#E4258F'
          };
        }
      }
    });

    return parsedDates;
  };

  // Use useMemo to avoid recalculating marked dates unnecessarily
  const newMarkedDates = useMemo(() => parseDates(periods), [periods]);

  // Merge markedDates prop with parsed period dates
  const combinedMarkedDates = { ...markedDates, ...newMarkedDates };

  return (
    <View className=''>
      <View className='flex-grow'>
        <CalendarList
          onDayPress={onDayPress}
          markingType={'multi-dot'}
          markedDates={combinedMarkedDates}
          pastScrollRange={24}
          futureScrollRange={3}
          scrollEnabled={true}
          showScrollIndicator={true}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#E4258F',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#E4258F',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#E4258F',
            selectedDotColor: '#ffffff',
            arrowColor: '#E4258F',
            monthTextColor: '#E4258F',
            indicatorColor: '#E4258F',
          }}
        />
      </View>
    </View>
  );
};

export default memo(PeriodCalendar);
