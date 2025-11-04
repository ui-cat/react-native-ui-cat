import { IconPack } from '@ui-cat/components';
import { SvgProps } from 'react-native-svg';
import { createIconsMap } from './createIconsMap';

export const EvaIconsPack: IconPack<SvgProps> = {
  name: 'eva',
  icons: createIconsMap(),
};
