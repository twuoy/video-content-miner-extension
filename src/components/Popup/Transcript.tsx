import React, { FC, useState } from "react";
import { Divider, Timeline } from '@mantine/core';
import * as types from '../../type';
import TranscriptLine from './TranscriptLine';

interface TranscriptProps {
  transcriptLines: types.TranscriptLineInfo[];
  tabInfo: types.TabInfo;
}

const Transcript: FC<TranscriptProps> = (props) => {
  const { transcriptLines, tabInfo } = props;
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  const updateVideoTime = (lineInfo: types.TranscriptLineInfo, selectedTimeIndex: number) => {
    const tabID = tabInfo.id as number;
    const message = {
      action: "setVideoTimestamp",
      payload: {
        startTimeSec: Math.floor(lineInfo.start),
      },
    };
    chrome.tabs.sendMessage(tabID, message);
    setSelectedTimeIndex(selectedTimeIndex);
  }

  return (
    <div>
      <Timeline color="cyan" radius="md" active={selectedTimeIndex}>
        {
          transcriptLines.map((lineInfo, index) => (
            <Timeline.Item key={index} title={`${Math.floor(lineInfo.start)}s`}>
              <TranscriptLine key={index} timeLineIndex={index} lineInfo={lineInfo} updateVideoTime={updateVideoTime}/>
              <Divider size="sm"></Divider>
            </Timeline.Item>
          ))
        }
      </Timeline>
    </div>
  );
}

export default Transcript;