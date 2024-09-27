import EditCalender from '@/components/EditCalender';
import ViewCalender from '@/components/ViewCalender';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useAuth } from '../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPeriods, getUser } from '@/queries/queries';

const Calender = () => {
  const queryClient = useQueryClient();

  const [logPeriod, setLogPeriod] = useState(false);

  const [selectedDays, setSelectedDays] = useState({});
  const { user } = useAuth();
  const { data: userData, error, isLoading } = useQuery({ queryKey: ['user'], queryFn: () => getUser(user?.email) })
  const { data: periods } = useQuery({ queryKey: ['periods'], queryFn: () => getPeriods(userData?.id) })

  const markedDates = useMemo(() => selectedDays, [selectedDays]);

  const onDayPress = useCallback((day: any) => {
    const dateString = day.dateString;
  
    setSelectedDays((prevSelectedDays) => {
      const newSelectedDays: any = { ...prevSelectedDays };
  
      if (newSelectedDays[dateString]) {
        // Unselect the date
        delete newSelectedDays[dateString];
      } else {
        // Select the date
        newSelectedDays[dateString] = {
          selected: true,
          marked: true,
          selectedColor: '#E4258F'
        };
      }
  
      // Return the updated marked dates
      return newSelectedDays;
    });
  }, []);
    
  const handleSubmit = async (newPeriod: { start_date: any, end_date: any, user_id: number }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/periods`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(newPeriod)
      });
      const body = await response.text();

      if (!response.ok) {
        console.error("Error: ", body);
        return;
      }
      setLogPeriod(false)

      console.log("Period saved: ", body);
    } catch (error) {
      console.error("Unexpected Error: ", error)
    }
  };

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (newPeriod: { start_date: any, end_date: any, user_id: number }) => handleSubmit(newPeriod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periods'] })
    }
  });

  const handlePeriodConflicts = (newPeriod: { start_date: string, end_date: string }, periods: any) => {
    let mergedPeriods = [...periods];
  
    // Example logic to handle merging or splitting
    mergedPeriods = mergedPeriods.filter((period: any) => {
      const periodStart = new Date(period.start_date);
      const periodEnd = new Date(period.end_date);
      const newPeriodStart = new Date(newPeriod.start_date);
      const newPeriodEnd = new Date(newPeriod.end_date);
  
      // Check for overlap or adjacency and merge periods
      if (newPeriodEnd >= periodStart && newPeriodStart <= periodEnd) {
        period.start_date = new Date(Math.min(periodStart.getTime(), newPeriodStart.getTime())).toISOString().split('T')[0];
        period.end_date = new Date(Math.max(periodEnd.getTime(), newPeriodEnd.getTime())).toISOString().split('T')[0];
        return true;
      }
  
      return true;
    });
  
    return mergedPeriods;
  };
  

  const onSubmit = () => {
    if (selectedDays) {
      const selectedDates = Object.keys(selectedDays).sort();
      const start_date = selectedDates[0];
      const end_date = selectedDates[selectedDates.length - 1];
      const user_id = userData?.id;
  
      const newPeriod = { user_id, start_date, end_date };
  
      const updatedPeriods = handlePeriodConflicts(newPeriod, periods);
  
      mutate(updatedPeriods);
    }
  }
  return (
    <View className='bg-white'>
      {!logPeriod && (
        <View className='items-center justify-center'>
          <TouchableOpacity className='justify-center items-center p-3 bg-[#E4258F] w-[30%] rounded-2xl my-4' onPress={() => setLogPeriod(!logPeriod)}>
            <Text className='text-white'>Log period</Text>
          </TouchableOpacity>
        </View>
      )}
      {logPeriod ? (
        <>
          <EditCalender onDayPress={onDayPress} periods={periods} markedDates={markedDates} />
          <View className='flex flex-row justify-between items-center mt-auto w-full py-2 bg-white'>
            <TouchableOpacity onPress={() => setLogPeriod(false)} className='justify-center items-center bg-[white] border border-black/40 w-[150px] p-3 rounded-xl ml-6'>
              <Text className='text-black text-xl font-bold'>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSubmit} className='justify-center items-center bg-[#E4258F] w-[150px] p-3 rounded-xl mr-6'>
              <Text className='text-white text-xl font-bold'>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ViewCalender periods={periods} />
      )}
    </View>
  );
}

export default Calender;
