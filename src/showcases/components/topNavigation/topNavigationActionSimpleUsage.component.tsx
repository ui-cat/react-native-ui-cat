import React from 'react';
import { Icon, IconElement, TopNavigationAction } from '@ui-cat/components';
import { TouchableWebElement } from '@ui-cat/components/devsupport';

const BackIcon = (props): IconElement => (
  <Icon
    {...props}
    name='arrow-back'
  />
);

export const TopNavigationActionSimpleUsageShowcase = (): TouchableWebElement => (
  <TopNavigationAction icon={BackIcon} />
);
