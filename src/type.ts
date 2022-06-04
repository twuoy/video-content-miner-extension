import * as contansts from './contanst';

export type TranscriptInfo = {
  transcript: TranscriptLineInfo[];
  tabInfo: TabInfo;
};

export type TranscriptLineInfo = {
  text: string;
  start: number;
  duration: number;
};

export type TabInfo = {
  id: number | undefined;
  url: string;
};

type SetVideoTimestampAction = {
  action: contansts.MessageAction.SetVideoTimestamp;
  payload: {
    startTimeSec: number;
  };
};

export type MessageAction = SetVideoTimestampAction;
