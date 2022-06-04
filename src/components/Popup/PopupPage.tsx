import React, { FC, useState } from 'react';
import { Box, Title, Space } from '@mantine/core';
import * as types from '../../type';
import Transcript from './Transcript';
import MiningForm from './MiningForm';

interface PopupPageProps {
}

const PopupPage: FC<PopupPageProps> = () => {
  const [{ transcript, tabInfo }, setTranscriptInfo] = useState<types.TranscriptInfo>(
    { transcript: [], tabInfo: { id: undefined, url: '' }}
  );

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

  const getCurrentTab = (): Promise<chrome.tabs.Tab> => {
    return new Promise(function(resolve, reject) {
      chrome.tabs.query(
        {active: true, currentWindow: true},
        (tabs) => { resolve(tabs[0]) }
      )
    });
  }

  const notifyFetchTranscript = async (keyword: string) => {
    const { id: tabID, url: videoURL } = await getCurrentTab();
    if (!videoURL || !tabID) throw new Error('Can not get url and id of current tab.');

    console.info(`notify to fetch transcript of video: ${videoURL}`);
    const transcript = await fetchTranscript(videoURL);
    const matchedLines = transcript.filter((lineInfo) => lineInfo.text.includes(keyword));
    const VideoURLWithoutTimeQuery = videoURL.replace(/&t=(\d+)s/g, '');

    setTranscriptInfo({transcript: matchedLines, tabInfo: { url: VideoURLWithoutTimeQuery, id: tabID }});
  };

  return (
    <Box mx="auto">
      <Title order={2} align='center'>Miner</Title>
      <Space h="md" />
      <MiningForm notifyFetchTranscript={notifyFetchTranscript} />
      <Space h="md" />
      {
        transcript.length !== 0 && 
          <>
            <hr className="rounded"></hr>
            <Transcript transcript={transcript} tabInfo={tabInfo} />
          </>
      }
    </Box>
  );
}

export default PopupPage;
