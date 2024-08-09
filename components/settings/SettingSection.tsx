import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingItem from '@/components/settings/SettingsItem';

const SettingSection = ({
  title,
  icon,
  items,
  onItemPress,
}: {
  title: string;
  icon: any;
  items: { title: string; id: string }[];
  onItemPress: (id: string) => void;
}) => (
  <View>
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
    {items.map((item) => (
      <SettingItem
        key={item.id}
        title={item.title}
        onPress={() => onItemPress(item.id)}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  sectionHeaderText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
});

export default SettingSection;
