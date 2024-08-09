import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';

const PeriodCalendar = ({ onDayPress, markedDates, periods } : { onDayPress: any, markedDates: any, periods: any }) => {
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
  const newMarkedDates = parseDates(periods)
  
  const updateMarkedDates = { ...markedDates, ...newMarkedDates }


  return (
    <View className=''>
      <View className='flex-grow'>
        <CalendarList
          onDayPress={onDayPress}
          markingType={'multi-dot'}
          markedDates={updateMarkedDates}
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

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#E4258F',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default memo(PeriodCalendar);
