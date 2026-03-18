import { IconProvider } from '@ui-cat/components';
import { StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { findIconByName } from 'react-native-eva-icons';

type TintableStyle = {
  tintColor?: string;
};

export const createIconsMap = (): Record<string, IconProvider<SvgProps>> => {
  return new Proxy({}, {
    get(_: unknown, name: string): IconProvider<SvgProps> {
      const icon = findIconByName(name);

      return {
        toReactElement: (props?: SvgProps) => {
          if (!icon) {
            return null;
          }

          const flattenedStyle = StyleSheet.flatten(props?.style || {}) as TintableStyle;
          const fillColor = typeof flattenedStyle?.tintColor === 'string' ? flattenedStyle.tintColor : undefined;

          return icon.toSvg({
            ...props,
            fill: props?.fill ?? fillColor,
            width: props?.width ?? 24,
            height: props?.height ?? 24,
          });
        },
      };
    },
  });
};
