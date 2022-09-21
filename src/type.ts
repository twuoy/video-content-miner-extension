import * as contansts from './contanst';

export type TranscriptInfo = {
  matchedTranscriptLine: TranscriptLineInfo[];
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

export type PopupToBGhandshakeAction = {
  action: contansts.MessageAction.PopupToBGHandshake;
  payload: {};
};

export type SendTabInfoAction = {
  action: contansts.MessageAction.SendTabInfo;
  payload: {
    tabID: number;
    tabURL: string;
  };
};

export type SetVideoTimestampAction = {
  action: contansts.MessageAction.SetVideoTimestamp;
  payload: {
    startTimeSec: number;
  };
};

export type MessageAction = PopupToBGhandshakeAction | SetVideoTimestampAction | SendTabInfoAction;
