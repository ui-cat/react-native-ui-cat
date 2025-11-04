import React from 'react';
import { ThemeStyleType } from '@ui-cat/eva-design-dss';

const defaultValue: ThemeStyleType = {};

export const MappingContext: React.Context<ThemeStyleType> = React.createContext(defaultValue);
