import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import periodTracker from "../assets/images/periodtracker.png"
import chatbot from "../assets/images/chatbot.jpg"
import doctor from "../assets/images/doctor.jpg"
import Chat from '@/components/Chat';

const PeriodTracker = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
      <View style={styles.card}>
        <Image
          source={periodTracker} // Replace with your image path
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>Keep track of your periods</Text>
        <Text style={styles.subtitle}>Don't be caught off guard</Text>
        {selectedDate && (<Text style={{ fontSize: 16, color: '#E4258F', fontWeight: 'bold', marginBottom: 20 }}>Previous period date: {selectedDate}</Text>)}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={styles.buttonText}>Select Previous Period Date</Text>
        </TouchableOpacity>
      </View>

      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#E4258F' },
            }}
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
      )}

      <View style={styles.card}>
        <Image
          source={doctor} // Replace with your image path
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>Personal Doctor</Text>
        <Text style={styles.subtitle}>Your doctor's detail</Text>
        {selectedDate && (<Text style={{ fontSize: 16, color: '#E4258F', fontWeight: 'bold', marginBottom: 20 }}>Previous period date: {selectedDate}</Text>)}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowChat(true)}
        >
          <Text style={styles.buttonText}>Connect with our doctors</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Image
          source={chatbot}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>Reach us and talk to our advanced chatbot</Text>
        <Text style={styles.subtitle}>How may I help you ?</Text>
        {selectedDate && (<Text style={{ fontSize: 16, color: '#E4258F', fontWeight: 'bold', marginBottom: 20 }}>Previous period date: {selectedDate}</Text>)}
        <TouchableOpacity
          style={styles.button}
        >
          <Text style={styles.buttonText}>Chat with out chatbot</Text>
        </TouchableOpacity>
        {showChat && <Chat setShowChat={setShowChat} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginBottom:20
  },
  card: {
    borderColor: '#E4258F',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    marginTop:20,

  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E4258F',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00a8e8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default PeriodTracker;