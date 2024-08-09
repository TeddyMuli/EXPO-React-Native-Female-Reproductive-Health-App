import { useAuth } from "@/app/context/AuthContext";
import { getUser } from "@/queries/queries";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { Image, Modal, SafeAreaView, Switch, Text, TouchableOpacity, View, TouchableWithoutFeedback, TextInput } from "react-native";

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

  if (userData) {
    setReadOnly(true);
  }

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

        <TouchableOpacity className="p-3 bg-[#E4258F] rounded-xl w-24">
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

  const handleSubmit = () => {
    if (pin !== confirmPin) {
      setError('Pins do not match');
      return;
    }
    console.log("Pin: ", pin);
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
      <Modal>
        <View>

        </View>
      </Modal>
    )}
    </>
  );
}

export const Themes = () => {
  const [darkMode, setDarkMode] = useState(false);

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
          onValueChange={() => setDarkMode(!darkMode)}
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

  const handleToggle = (index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
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
          onValueChange={() => setBackUpData(!backupData)}
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
            <TouchableOpacity className="p-3 bg-[#E4258F] rounded-xl w-24">
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
