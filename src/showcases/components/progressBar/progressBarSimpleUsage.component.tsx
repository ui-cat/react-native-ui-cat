import React from 'react';
import { ProgressBar } from '@ui-cat/components';
import { useProgress } from '../../helpers/progress.hook';

export const ProgressBarSimpleUsageShowcase = (): React.ReactElement => {
  const progress = useProgress();
  return (
    <ProgressBar
      progress={progress}
    />
  );
};
