// src/components/SettingsContext.jsx
import React, { createContext } from 'react';

export const SettingsContext = createContext({
  tabStyle: 'style1',
  onChangeTabStyle: () => {},
});