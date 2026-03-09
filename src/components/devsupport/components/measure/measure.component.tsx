/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  Platform,
  UIManager,
  StatusBar,
} from 'react-native';
import { Frame } from './type';

export interface MeasureElementProps {
  force?: boolean;
  shouldUseTopInsets?: boolean;
  onMeasure: (frame: Frame) => void;
  children: React.ReactElement;
}

export type MeasuringElement = React.ReactElement;
/**
 * Measures child element size and it's screen position asynchronously.
 * Returns measure result in `onMeasure` callback.
 *
 * Usage:
 *
 * ```tsx
 * const onMeasure = (frame: Frame): void => {
 *   const { x, y } = frame.origin;
 *   const { width, height } = frame.size;
 *   ...
 * };
 *
 * <MeasureElement
 *   shouldUseTopInsets={ModalService.getShouldUseTopInsets}
 *   onMeasure={onMeasure}>
 *   <ElementToMeasure />
 * </MeasureElement>
 * ```
 *
 * By default, it measures each time onLayout is called,
 * but `force` property may be used to measure any time it's needed.
 * DON'T USE THIS FLAG IF THE COMPONENT RENDERS FIRST TIME OR YOU KNOW `onLayout` WILL BE CALLED.
 */
export const MeasureElement: React.FC<MeasureElementProps> = (props): MeasuringElement => {

  const ref = React.useRef<any>(null);
  const rafId = React.useRef<number | null>(null);
  const retryCount = React.useRef<number>(0);

  const bindToWindow = (frame: Frame, window: Frame): Frame => {
    if (frame.origin.x < window.size.width) {
      return frame;
    }

    const boundFrame: Frame = new Frame(
      frame.origin.x - window.size.width,
      frame.origin.y,
      Math.floor(frame.size.width),
      Math.floor(frame.size.height),
    );

    return bindToWindow(boundFrame, window);
  };

  const scheduleRemeasure = (): void => {
    if (retryCount.current >= 10) {
      return;
    }
    retryCount.current += 1;

    if (rafId.current != null) {
      return;
    }

    // On web, layout/DOM measurements can be 0 until the next paint.
    // Using rAF prevents tight recursion loops and plays nicer with concurrent rendering.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: requestAnimationFrame exists on web
    const requestFrame = globalThis?.requestAnimationFrame;
    if (typeof requestFrame === 'function') {
      rafId.current = requestFrame(() => {
        rafId.current = null;
        measureSelf();
      });
    } else {
      // Fallback for non-web environments
      setTimeout(measureSelf, 0);
    }
  };

  const onUIManagerMeasure = (x: number, y: number, w: number, h: number): void => {
    if (!w && !h) {
      scheduleRemeasure();
      return;
    }

    retryCount.current = 0;
    const originY = props.shouldUseTopInsets ? y + (StatusBar.currentHeight || 0) : y;
    const frame: Frame = bindToWindow(new Frame(x, originY, Math.floor(w), Math.floor(h)), Frame.window());
    props.onMeasure(frame);
  };

  const getMeasureTarget = (target: any): any => {
    if (!target) {
      return null;
    }
    // Some RN components on web expose getNode() returning the host node.
    if (typeof target.getNode === 'function') {
      return target.getNode();
    }
    return target;
  };

  const measureSelf = (): void => {
    const target = getMeasureTarget(ref.current);
    if (!target) {
      return;
    }

    // RN Web doesn't support findNodeHandle; measure directly from the DOM node when possible.
    if (Platform.OS === 'web') {
      const domNode = target?.getBoundingClientRect ? target : target?.current;
      if (domNode?.getBoundingClientRect) {
        const rect = domNode.getBoundingClientRect();
        onUIManagerMeasure(rect.left, rect.top, rect.width, rect.height);
        return;
      }
    }

    // Native platforms (and some web implementations) support UIManager.measureInWindow with a host handle.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (UIManager as any).measureInWindow(target, onUIManagerMeasure);
  };

  React.useLayoutEffect(() => {
    if (props.force) {
      measureSelf();
    }
  });

  React.useEffect(() => {
    return () => {
      if (rafId.current != null) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: cancelAnimationFrame exists on web
        globalThis?.cancelAnimationFrame?.(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  const childOnLayout = (props.children as any).props?.onLayout;
  const onLayout = (...args: any[]): void => {
    childOnLayout?.(...args);
    measureSelf();
  };

  return React.cloneElement(props.children, { ref, onLayout });
};
