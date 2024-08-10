import { useAuth } from "@/app/context/AuthContext";
import { getUser } from "@/queries/queries";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Modal, SafeAreaView, Switch, Text, TouchableOpacity, View, TouchableWithoutFeedback, TextInput, StyleSheet } from "react-native";

export const CycleReminders = () => {
  const options =[
    { name: "Period reminders", content: "Remind me at the beginning and the end of period" },
    { name: "Fertility reminders", content: "Reminder that is triggered 1 day before you become fertile" },
    { name: "Ovulation reminders", content: "Reminder that is triggered 1 day before you become ovulate" }
  ];

  const [toggleStates, setToggleStates] = useState(options.map(() => false));

  const handleToggle = (index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
  };

  useEffect(() => {
    const loadToggleStates = async () => {
      try {
        const savedStates = await AsyncStorage.getItem('toggleStates');
        if (savedStates !== null) {
          setToggleStates(JSON.parse(savedStates));
        }
      } catch (error) {
        console.error('Failed to load toggle states:', error);
      }
    };

    loadToggleStates();
  }, []);

  useEffect(() => {
    const saveToggleStates = async () => {
      try {
        await AsyncStorage.setItem('toggleStates', JSON.stringify(toggleStates));
      } catch (error) {
        console.error('Failed to save toggle states:', error);
      }
    };

    saveToggleStates();
  }, [toggleStates]);

  return (
    <View style={{ marginHorizontal: 16 }} className={`flex gap-6 text-black w-full`}>
      {options.map((item, index) => (
        <View key={index} className="flex flex-row gap-2">
          <View className="flex-1">
            <Text className="font-semibold">{item.name}</Text>
            <Text className="flex max-w-[360px]">{item.content}</Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#FF69B4" }}
            thumbColor={toggleStates[index] ? "#fff" : "#f4f3f4"}
            onValueChange={() => handleToggle(index)}
            value={toggleStates[index]}
          />
        </View>
      ))}
    </View>
  );
}

export const MedicineReminder = () => {
  const [remindMedicine, setRemindMedicine] = useState(false);

  useEffect(() => {
    const loadRemindMedicine = async () => {
      try {
        const savedState = await AsyncStorage.getItem('remindMedicine');
        if (savedState !== null) {
          setRemindMedicine(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Failed to load remindMedicine state:', error);
      }
    };

    loadRemindMedicine();
  }, []);

  useEffect(() => {
    const saveRemindMedicine = async () => {
      try {
        await AsyncStorage.setItem('remindMedicine', JSON.stringify(remindMedicine));
      } catch (error) {
        console.error('Failed to save remindMedicine state:', error);
      }
    };

    saveRemindMedicine();
  }, [remindMedicine]);

  return (
    <View style={{ marginHorizontal: 16 }} className="flex flex-row text-black">
      <View className="flex-1">
        <Text className="font-semibold">Medicine Reminder</Text>
        <Text className="flex max-w-[360px]">Remind me to take my medicine on time</Text>
      </View>
      <Switch
        className="ml-auto"
        trackColor={{ false: "#767577", true: "#FF69B4" }}
        thumbColor={remindMedicine ? "#fff" : "#f4f3f4"}
        onValueChange={() => setRemindMedicine(true)}
        value={remindMedicine}
      />
    </View>
  );
}

export const ContraceptionReminders = () => {
  const [trackContraception, setTrackContraception] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [clickMethod, setClickMethod] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("")

  const methods = [
    { name: "Birth control pills", icon: "pill" },
    { name: "Patch", icon: "bandage" },
    { name: "IUD", icon: "medical" },
    { name: "V-Ring", icon: "ellipse" },
    { name: "Injection", icon: "syringe" },
    { name: "Implant", icon: "implant" },
  ];

  useEffect(() => {
    const loadStates = async () => {
      try {
        const savedTrackContraception = await AsyncStorage.getItem('trackContraception');
        const savedReminder = await AsyncStorage.getItem('reminder');
        const savedClickMethod = await AsyncStorage.getItem('clickMethod');
        const savedSelectedMethod = await AsyncStorage.getItem('selectedMethod');

        if (savedTrackContraception !== null) setTrackContraception(JSON.parse(savedTrackContraception));
        if (savedReminder !== null) setReminder(JSON.parse(savedReminder));
        if (savedClickMethod !== null) setClickMethod(JSON.parse(savedClickMethod));
        if (savedSelectedMethod !== null) setSelectedMethod(savedSelectedMethod);
      } catch (error) {
        console.error('Failed to load states:', error);
      }
    };

    loadStates();
  }, []);

  useEffect(() => {
    const saveStates = async () => {
      try {
        await AsyncStorage.setItem('trackContraception', JSON.stringify(trackContraception));
        await AsyncStorage.setItem('reminder', JSON.stringify(reminder));
        await AsyncStorage.setItem('clickMethod', JSON.stringify(clickMethod));
        await AsyncStorage.setItem('selectedMethod', selectedMethod);
      } catch (error) {
        console.error('Failed to save states:', error);
      }
    };

    saveStates();
  }, [trackContraception, reminder, clickMethod, selectedMethod]);

  return (
    <>
      {!clickMethod ? (
        <SafeAreaView className="flex mx-4">
          <View className="flex flex-row justify-center items-center border-b border-b-black/20">
            <Text className="font-semibold">Track contraception</Text>
            <Switch
              className="ml-auto"
              trackColor={{ false: "#767577", true: "#FF69B4" }}
              thumbColor={trackContraception ? "#fff" : "#f4f3f4"}
              onValueChange={() => setTrackContraception(!trackContraception)}
              value={trackContraception}
            />
          </View>
  
          <View className="my-4">
            <TouchableOpacity className="flex flex-row" onPress={() => setClickMethod(true)}>
              <View className="flex-1">
                <Text className="font-semibold">Method of contraception</Text>
                <Text>{selectedMethod}</Text>
              </View>
              <Ionicons className="ml-auto" name="chevron-forward-outline" size={24} color="#E4258F" />
            </TouchableOpacity>
          </View>
  
          <View className="my-4">
            <Text className="font-semibold text-[#E4258F]">Reminders</Text>
            <View className="flex flex-row my-4">
              <View className="flex-1">
                <Text className="font-semibold">Contraception reminders</Text>
                <Text className="flex max-w-[360px]">Remind me to take my medicine on time</Text>
              </View>
              <Switch
                className="ml-auto"
                trackColor={{ false: "#767577", true: "#FF69B4" }}
                thumbColor={reminder ? "#fff" : "#f4f3f4"}
                onValueChange={() => setReminder(!reminder)}
                value={reminder}
              />
            </View>
          </View>
  
          <View className="mt-auto justify-center items-center">
            <TouchableOpacity className="mt-auto p-3 bg-[#E4258F] rounded-xl w-[60%] justify-center">
              <Text className="text-white text-center text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <Modal>
          <View className="flex m-4 ">
            <View className="flex flex-row gap-6 items-center mb-10">
              <Ionicons onPress={() => setClickMethod(false)} name="chevron-back-outline" size={24} color="black" />
              <Text className="font-medium text-lg">Methods of contraception</Text>
            </View>
            {methods.map((method, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedMethod(method.name)} className={`flex flex-row mb-4 justify-center items-center p-3 ${selectedMethod === method.name && "bg-pink-100 border border-pink-500 rounded-xl"}`}>
                <View className="flex flex-row gap-3 justify-center items-center">
                  <Image source={require("@/assets/images/profile.png")} width={4} height={4} className="rounded-full w-12 h-12" />
                  <Text>{method.name}</Text>
                </View>
                
                <View className={`ml-auto w-6 h-6 rounded-full ${selectedMethod === method.name && "border-2 border-pink-500"} flex items-center justify-center`}>
                  <View className={`w-3 h-3 rounded-full ${selectedMethod === method.name ? "bg-pink-500" : "bg-none"}`} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      )}
    </>
  )
}

export const MeditationReminder = () => {
  const [meditationReminder, setMeditationReminder] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedMeditationReminder = await AsyncStorage.getItem('meditationReminder');
        if (savedMeditationReminder !== null) {
          setMeditationReminder(JSON.parse(savedMeditationReminder));
        }
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('meditationReminder', JSON.stringify(meditationReminder));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    };

    saveState();
  }, [meditationReminder]);

  return (
    <View className="mx-4 flex flex-row">
      <View className="flex-1">
        <Text className="font-semibold">Meditation Reminder</Text>
        <Text className="flex max-w-[300px]">Remind me to practice conscious braething every day</Text>
      </View>
      <Switch
        className="ml-auto px-2"
        trackColor={{ false: "#767577", true: "#FF69B4" }}
        thumbColor={meditationReminder ? "#fff" : "#f4f3f4"}
        onValueChange={() => setMeditationReminder(!meditationReminder)}
        value={meditationReminder}
      />
    </View>
  );
}

export const DailyLoggingReminders = () => {
  const [dailyLoggingReminders, setDailyLoggingReminders] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedDailyLoggingReminders = await AsyncStorage.getItem('dailyLoggingReminders');
        if (savedDailyLoggingReminders !== null) {
          setDailyLoggingReminders(JSON.parse(savedDailyLoggingReminders));
        }
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('dailyLoggingReminders', JSON.stringify(dailyLoggingReminders));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    };

    saveState();
  }, [dailyLoggingReminders]);
  return (
    <View className="mx-4 flex flex-row">
      <View className="flex-1">
        <Text className="font-semibold">Daily logging reminders</Text>
        <Text className="flex max-w-[360px]">Remind me to record important information in the app everyday</Text>
      </View>
      <Switch
        className="ml-auto"
        trackColor={{ false: "#767577", true: "#FF69B4" }}
        thumbColor={dailyLoggingReminders ? "#fff" : "#f4f3f4"}
        onValueChange={() => setDailyLoggingReminders(!dailyLoggingReminders)}
        value={dailyLoggingReminders}
      />
    </View>
  );
}

export const TrackingReminder = () => {
  const [trackingReminder, setTrackingReminder] = useState(false);

  return (
    <View className="mx-4">
      <View className="flex flex-row my-4 border-b border-b-black/20 py-2">
        <View className="flex-1">
          <Text className="font-semibold">Tracking Reminder</Text>
          <Text className="flex max-w-[300px]">Once a week remind me record my well-being details in the app i f i havent logged anything for a while</Text>
        </View>
        <Switch
          className="ml-auto"
          trackColor={{ false: "#767577", true: "#FF69B4" }}
          thumbColor={trackingReminder ? "#fff" : "#f4f3f4"}
          onValueChange={() => setTrackingReminder(!trackingReminder)}
          value={trackingReminder}
        />
      </View>
      <View className="flex flex-row">
        <Text>Time</Text>
        <Text className="ml-auto text-[#E4258F]">9:00 A.M</Text>
      </View>
    </View>
  );
}

export const SecretReminders = () => {
  const [isSecret, setIsSecret] = useState(false);
  
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedIsSecret = await AsyncStorage.getItem('isSecret');
        if (savedIsSecret !== null) {
          setIsSecret(JSON.parse(savedIsSecret));
        }
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('isSecret', JSON.stringify(isSecret));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    };

    saveState();
  }, [isSecret]);

  return (
    <View className="mx-6">
      <Text className="">Choose the apearance of your reminders</Text>
      <TouchableOpacity onPress={() => setIsSecret(false)} className="my-6 flex flex-row justify-center items-center">
        <View className={`p-3 flex flex-row justify-center items-center rounded-xl border ${!isSecret ? "border-pink-500" : "border-black/30"}`}>
          <Image source={require("@/assets/images/profile.png")} className="w-12 h-12" />
          <View className="ml-4">
            <Text className="font-semibold">My Calender</Text>
            <Text>Your period is due on Friday</Text>
          </View>
        </View>

        <View className={`ml-auto w-6 h-6 rounded-full border-2 ${!isSecret ? " border-pink-500" : "border-black/30"} flex items-center justify-center`}>
          <View className={`w-3 h-3 rounded-full ${!isSecret ?  "bg-pink-500" : "bg-none"}`} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSecret(true)} className="my-6 flex flex-row justify-center items-center">
        <View className={`p-3 flex flex-row justify-center items-center rounded-xl border ${isSecret ? "border-pink-500" : "border-black/30"}`}>
          <Image source={require("@/assets/images/profile.png")} className="w-12 h-12" />
          <View className="ml-4">
            <Text className="font-semibold">My Calender</Text>
            <Text>Your period is due on Friday</Text>
          </View>
        </View>

        <View className={`ml-auto w-6 h-6 rounded-full border-2 ${isSecret ? " border-pink-500" : "border-black/30"} flex items-center justify-center`}>
          <View className={`w-3 h-3 rounded-full ${isSecret ?  "bg-pink-500" : "bg-none"}`} />
        </View>
      </TouchableOpacity>

    </View>
  );
}

export const YourName = () => {
  const { user } = useAuth();
  const { data: userData } = useQuery({ queryKey: ["user"], queryFn: () => getUser(user?.email) })
  const [name, setName] = useState(userData?.name || "");
  const [readOnly, setReadOnly] = useState(false);

useEffect(() => {
    const loadName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setName(storedName);
        setReadOnly(true);
      }
    };
    loadName();
  }, []);

  const saveName = async () => {
    await AsyncStorage.setItem('userName', name);
    setReadOnly(true);
  };

  return (
    <View className="mx-4">
      <Text className="my-4">Tell us what to call you</Text>
      <TextInput 
        placeholder="First name" 
        readOnly={readOnly}
        value={name}
        onChangeText={value => setName(value)}
        className="mb-4 rounded-xl border border-black p-3 text-black"
      />

      <View className="flex flex-row gap-4 justify-between items-center">
        <TouchableOpacity className="bg-white border border-black/20 p-3 rounded-xl w-24">
          <Text className="font-semibold text-black text-center">Close</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={saveName} className="p-3 bg-[#E4258F] rounded-xl w-24">
          <Text className="font-semibold text-white text-center">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const SecureAccess = () => {
  const [pin, setPin] = useState("");
  const [useBio, setUseBio] = useState(false);
  const [showPinPage, setShowPinPage] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = (text: string) => {
    if (/^\d*$/.test(text) && text.length <= 4) {
      setPin(text);
    }
  };

  const handleConfirmPinChange = (text: string) => {
    if (/^\d*$/.test(text) && text.length <= 4) {
      setConfirmPin(text);
    }
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 characters");
    } else if (pin !== confirmPin) {
      setError("PINs do not match");
    } else {
      setPin('');
      setConfirmPin('');
      setShowPinPage(false)
    }
  };

  return (
    <>
    {!showPinPage ? (
    <View className="mx-4">
      <View className="flex flex-row my-4">
        <View className="flex-1">
          <Text className="font-semibold">PIN</Text>
          <Text className="flex max-w-[360px]">Choose a pin for your app</Text>
        </View>
        <Switch
          className="ml-auto"
          trackColor={{ false: "#767577", true: "#FF69B4" }}
          thumbColor={pin ? "#fff" : "#f4f3f4"}
          onValueChange={() => setShowPinPage(true)}
          value={showPinPage}
        />
      </View>

      <View className="flex flex-row">
        <View className="flex-1">
          <Text className="font-semibold">Fingerprint or Face recognition</Text>
          <Text className="flex max-w-[360px]">If the device supports this function</Text>
        </View>
        <Switch
          className="ml-auto"
          trackColor={{ false: "#767577", true: "#FF69B4" }}
          thumbColor={useBio ? "#fff" : "#f4f3f4"}
          onValueChange={() => setUseBio(!useBio)}
          value={useBio}
        />
      </View>
    </View>
    ) : (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Enter 4-digit PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={handlePinChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                placeholder="Enter PIN"
              />
              <TextInput
                style={styles.pinInput}
                value={confirmPin}
                onChangeText={handleConfirmPinChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                placeholder="Confirm PIN"
              />      
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

export const Themes = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadDarkMode = async () => {
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      if (storedDarkMode !== null) {
        setDarkMode(JSON.parse(storedDarkMode));
      }
    };
    loadDarkMode();
  }, []);
  
  const saveDarkMode = async (value: boolean) => {
    await AsyncStorage.setItem('darkMode', JSON.stringify(value));
    setDarkMode(value);
  };

  return (
    <View className="mx-4">
      <View className="flex flex-row my-4 justify-center items-center">
        <View className="flex-1">
          <Text className="font-semibold">Dark mode</Text>
        </View>
        <Switch
          className="ml-auto"
          trackColor={{ false: "#767577", true: "#FF69B4" }}
          thumbColor={darkMode ? "#fff" : "#f4f3f4"}
          onValueChange={saveDarkMode}
          value={darkMode}
        />
      </View>
    </View>
  );
}

export const CalenderView = () => {
  const options = [
    { name: "Intercourse log", content: "Marks the days you have sex, protected or unprotected" },
    { name: "Ovulation and fertilty info", content: "Take note of when you are more or less likely to get pregnant" },
    { name: "Pill tracking", content: "Log when you take your birth control pills" }
  ];

  const [toggleStates, setToggleStates] = useState(options.map(() => false));

  useEffect(() => {
    const loadToggleStates = async () => {
      const storedToggleStates = await AsyncStorage.getItem('toggleStates');
      if (storedToggleStates !== null) {
        setToggleStates(JSON.parse(storedToggleStates));
      }
    };
    loadToggleStates();
  }, []);

  const handleToggle = async(index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
    await AsyncStorage.setItem('toggleStates', JSON.stringify(newToggleStates));
  };

  
  return (
    <View className="mx-4">
      {options.map((item, index) => (
        <View key={index} className="flex flex-row gap-2 mt-4">
          <View className="flex-1">
            <Text className="font-semibold">{item.name}</Text>
            <Text className="flex max-w-[360px]">{item.content}</Text>
          </View>
          <Switch
            className="ml-auto"
            trackColor={{ false: "#767577", true: "#FF69B4" }}
            thumbColor={toggleStates[index] ? "#fff" : "#f4f3f4"}
            onValueChange={() => handleToggle(index)}
            value={toggleStates[index]}
          />
        </View>
      ))}
    </View>
  );
}

export const BackupData = () => {
  const [backupData, setBackUpData] = useState(false);

  useEffect(() => {
    const loadBackupData = async () => {
      const storedBackupData = await AsyncStorage.getItem('backupData');
      if (storedBackupData !== null) {
        setBackUpData(JSON.parse(storedBackupData));
      }
    };
    loadBackupData();
  }, []);

  const handleToggle = async () => {
    const newBackupData = !backupData;
    setBackUpData(newBackupData);
    await AsyncStorage.setItem('backupData', JSON.stringify(newBackupData));
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="mx-4">
      <View className="flex flex-row justify-center items-center my-4">
        <View className="flex">
          <Text className="font-semibold text-lg">Auto backup</Text>
          <Text>Automatic data backup is perfomed every 5 days</Text>
        </View>
        <Switch
          className="ml-auto"
          trackColor={{ false: "#767577", true: "#FF69B4" }}
          thumbColor={backupData ? "#fff" : "#f4f3f4"}
          onValueChange={handleToggle}
          value={backupData}
        />
      </View>

      <View className="mt-[550px]">
        <View className="flex flex-row p-3 bg-white/10 rounded-xl border-2 border-black justify-center items-center" >
          <ShieldCheck size={36} className="text-black mr-4" />
          <View>
            <Text className="max-w-[300px]">We do not make use of your data and don't sell to third parties</Text>
            <TouchableOpacity>
              <Text className="text-[#E4258F] font-medium">Read more</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const RestoreData = () => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View className="m-4">
      <Text className="text-2xl font-semibold">Warning!</Text>
      <Text className="max-w-[360px] text-xl my-2">When you restore, the app data on your device is merged with the last backed up data</Text>

      <View>
        <View className="flex flex-row my-4 items-center rounded-xl border border-black/20 bg-white/70 p-3">
          <Mail className="mr-4 text-black/30" />
          <TextInput
            placeholder="Backup email"
            className="outline-none"
          />
        </View>

        <View className="flex flex-row my-4 items-center rounded-xl border border-black/20 bg-white/70 p-3">
          <LockKeyhole className="mr-4 text-black/30" />
          <TextInput
            placeholder="Password"
            className="outline-none"
            secureTextEntry={hidePassword}
          />
          {hidePassword ? <Eye onPress={() => setHidePassword(false)} className="text-black/30 ml-auto" /> : <EyeOff onPress={() => setHidePassword(true)} className="text-black/30 ml-auto" />}
        </View>
      </View>
    </View>
  );
}

export const DeleteData = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteData = async () => {
    try {
      await AsyncStorage.clear();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete data', error);
    }
  };

  return (
    <>
    {showModal && (
      <Modal>
        <View className="flex flex-col justify-center items-center">
          <Text className="text-2xl font-semibold">Warning!</Text>
          <Text className="max-w-[360px] text-xl my-2">When you delete, all data on your device will be lost</Text>
          <View className="flex flex-row gap-4">
            <TouchableOpacity onPress={() => setShowModal(false)} className="bg-white border border-black/20 p-3 rounded-xl w-24">
              <Text className="font-semibold text-black text-center">Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteData} className="p-3 bg-[#E4258F] rounded-xl w-24">
              <Text className="font-semibold text-white text-center">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}
    <SafeAreaView style={{ flex: 1 }} className="mx-4">
      <TouchableOpacity onPress={() => setShowModal(true)} className="flex flex-row justify-center items-center my-4">
        <View className="flex">
          <Text className="font-semibold text-lg">Delete data from phone</Text>
          <Text className="max-w-[300px]">You can restore data from  a backup if you have one</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={24} color="#E4258F" />
      </TouchableOpacity>

      <View className="mt-[550px]">
        <View className="flex flex-row p-3 bg-white/10 rounded-xl border-2 border-black justify-center items-center" >
          <ShieldCheck size={36} className="text-black mr-4" />
          <View>
            <Text className="max-w-[300px]">We do not make use of your data and don't sell to third parties</Text>
            <TouchableOpacity>
              <Text className="text-[#E4258F] font-medium">Read more</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
    </>
  );
}

export const Help = () => {
  return (
    <View>
      <Text>Cycle Reminders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pinInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#E4258F',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});