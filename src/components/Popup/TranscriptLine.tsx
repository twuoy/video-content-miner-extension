import React, { FC } from "react";
import { Text } from '@mantine/core';
import * as types from '../../type';

interface TranscriptLineProps {
  lineInfo: types.TranscriptLineInfo;
  timeLineIndex: number;
  updateVideoTime: (lineInfo: types.TranscriptLineInfo, selectedTimeIndex: number) => void;
}

const TranscriptLine: FC<TranscriptLineProps> = (props) => {
  const { lineInfo, timeLineIndex, updateVideoTime } = props;

  return (
    <Text
    color="dimmed"
    size="sm"
    variant="link"
    component="span"
    onClick={() => updateVideoTime(lineInfo, timeLineIndex)}
    >{lineInfo.text}</Text>
  );
}

export default TranscriptLine;
