import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingItem = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Text className='dark:text-white text-[16px] text-[#333]'>{title}</Text>
    <Ionicons name="chevron-forward" size={24} color="#888" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});

export default SettingItem;
