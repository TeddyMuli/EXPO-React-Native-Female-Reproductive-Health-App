import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const ViewCalender = ({ periods }: { periods: any }) => {

  function calculateCycleDates(startDate: string, cycleLength = 28, periodLength: number) {
    const start = new Date(startDate);
    const ovulationDate = new Date(start);
    ovulationDate.setDate(start.getDate() + cycleLength - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    const nextPeriodStart = new Date(start);
    nextPeriodStart.setDate(start.getDate() + cycleLength);

    const nextPeriodEnd = new Date(nextPeriodStart)
    nextPeriodEnd.setDate(nextPeriodStart.getDate() + periodLength)

    return {
      ovulationDate,
      fertileStart,
      fertileEnd,
      nextPeriodStart,
    };
  }

  function markDateRange(start: Date, end: Date, style: any) {
    const dates: any = {};
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const formattedDate = date.toISOString().split('T')[0];
      dates[formattedDate] = style;
    }
    return dates;
  }

  function parseDates(periods: any) {
    let markedDates: any = {};
    
    periods?.forEach((period: any) => {
      const startDate = new Date(period.start_date);
      const endDate = new Date(period.end_date);

      const periodLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Mark period days
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate: string = date.toISOString().split('T')[0];
        markedDates[formattedDate] = {
          selected: true,
          marked: true,
          selectedColor: '#E4258F',
        };
      }

      // Calculate and mark ovulation, fertile days, and next period days
      const { ovulationDate, fertileStart, fertileEnd, nextPeriodStart } = calculateCycleDates(period.start_date, period.cycle_length, periodLength);

      markedDates = {
        ...markedDates,
        ...markDateRange(fertileStart, fertileEnd, { selected: true, marked: true, selectedColor: 'purple' }),
        [ovulationDate.toISOString().split('T')[0]]: { selected: true, marked: true, selectedColor: 'gold' },
        [nextPeriodStart.toISOString().split('T')[0]]: { selected: true, marked: true, selectedColor: '#e884bc', },
      };
    });
  
    return markedDates;
  };
  
  const periodDates = parseDates(periods);

  return (
    <View>
      <Calendar
        markedDates={periodDates}
      />
    </View>
  );
}

export default ViewCalender;
