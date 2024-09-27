import React, { memo } from 'react';
import CountryPicker from 'react-native-country-picker-modal';

const CtryCode = ({ countryCode, onSelect } : { countryCode: any, onSelect: any }) => {
  return (
    <CountryPicker
      countryCode={countryCode}
      withCallingCode
      withFlag
      withFilter
      onSelect={onSelect}
    />
  );
}

export default memo(CtryCode);
