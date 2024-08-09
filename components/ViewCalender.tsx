import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const ViewCalender = ({ periods } : { periods: any }) => {
  function parseDates(periods: any) {
    const markedDates: any = {};
    
    periods?.forEach((period: any) => {
      const startDate = new Date(period.start_date);
      const endDate = new Date(period.end_date);
  
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate: string = date.toISOString().split('T')[0];
        markedDates[formattedDate]= {
          selected: true,
          marked: true,
          selectedColor: 'red'
        };
      }
    });
  
    return markedDates;
  }
  
  const markedDates = parseDates(periods);

  return (
    <View>
      <Calendar
        markedDates={markedDates}
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
  );
}

export default ViewCalender;
