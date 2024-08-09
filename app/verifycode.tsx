import { useRouter} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const verifyCode = () => {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark'/>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Passwordless Sign-in</Text>
      </View> */}
      
      <View style={styles.content}>
        <Text style={styles.title}>My <Text style={styles.titleHighlight}>FemiHub</Text></Text>
        
        <Text style={styles.instruction}>
          Please enter the verification code sent to your email:
        </Text>
        
        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => inputs.current[index] = el}
              style={styles.codeInput}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => handleCodeChange(text, index)}
              value={digit}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={()=>router.push('(tabs)/home')}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#E4258F',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
    marginTop:20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  titleHighlight: {
    color: '#E4258F',
  },
  instruction: {
    fontSize: 16,
    // textAlign: 'center',
    marginBottom: 24,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 36,
  },
  codeInput: {
    width: 40,
    height: 48,
    borderWidth: 1,
    borderColor: '#000000',
    textAlign: 'center',
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#00B0FF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#00B0FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default verifyCode;