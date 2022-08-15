import React, { FC, useEffect, useRef, useState, MutableRefObject } from 'react';
import { Box, Title, Space } from '@mantine/core';
import * as contansts from '../../contanst';
import * as types from '../../type';
import Transcript from './Transcript';
import MiningForm from './MiningForm';

interface PopupPageProps {
}

const PopupPage: FC<PopupPageProps> = () => {
  const [{ matchedTranscriptLine, tabInfo }, setTranscriptInfo] = useState<types.TranscriptInfo>(
    { matchedTranscriptLine: [], tabInfo: { id: undefined, url: '' }}
  );

  let tabID = useRef(-1);
  let videoURL = useRef('');
  let transcript: MutableRefObject<types.TranscriptLineInfo[]> = useRef([]);

  // get transcript of current video when popup clicked
  useEffect(() => {
    const handShakeMessage = {
      action: contansts.MessageAction.PopupToBGHandshake,
      payload: {},
    };

    chrome.runtime.sendMessage(handShakeMessage, async (response: types.SendTabInfoAction) => {
      console.log(`handshake response: ${JSON.stringify(response)}`);

      const { tabID: tabIDFromMsg, tabURL } = response.payload;
      tabID.current = tabIDFromMsg;
      videoURL.current = tabURL;

      const videoID = getVideoID(videoURL.current);
      if (videoID == null) {
        transcript.current = [];
        return;
      }

      const transcriptInStorage = await getTranscriptFromStorage(videoID);
      if (transcriptInStorage) {
        console.log('get transcript from storage!');
        transcript.current = transcriptInStorage;
        return;
      }

      const transcriptFromServer = await fetchTranscript(videoURL.current);
      chrome.storage.sync.set({[videoID]: JSON.stringify(transcriptFromServer)});
      transcript.current = transcriptFromServer;
    });
  }, []);

  const fetchTranscript = async (videoURL: string): Promise<types.TranscriptLineInfo[]> => {
    const endpoint = `${process.env.API_URL}/transcript`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ url: videoURL })
    });

    const transcript: types.TranscriptLineInfo[] = await response.json();
    return transcript;
  }

  const getTranscriptFromStorage = async (videoID: string): Promise<types.TranscriptLineInfo[] | undefined> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(videoID, (res) => {
        try {
          resolve(JSON.parse(res[videoID]));
        } catch (err) {
          resolve(undefined);
        }
      });
    });
  };

  const getVideoID = (videoURL: string) => {
    const queryParams = videoURL.split('?')[1];
    const urlSearchParams = new URLSearchParams(queryParams);
    const videoID = urlSearchParams.get('v');
    return videoID;
  };

  const notifyFetchTranscript = async (keyword: string) => {
    console.info(`notify to fetch transcript of video: ${videoURL.current}`);
    const matchedLines = transcript.current.filter((lineInfo) => lineInfo.text.includes(keyword));
    const VideoURLWithoutTimeQuery = videoURL.current.replace(/&t=(\d+)s/g, '');

    setTranscriptInfo({matchedTranscriptLine: matchedLines, tabInfo: { url: VideoURLWithoutTimeQuery, id: tabID.current }});
  };

  return (
    <Box mx="auto">
      <Title order={2} align='center'>Miner</Title>
      <Space h="md" />
      <MiningForm notifyFetchTranscript={notifyFetchTranscript} />
      <Space h="md" />
      {
        matchedTranscriptLine.length !== 0 && 
          <>
            <hr className="rounded"></hr>
            <Transcript transcriptLines={matchedTranscriptLine} tabInfo={tabInfo} />
          </>
      }
    </Box>
  );
}

export default PopupPage;
