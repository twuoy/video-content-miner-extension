import React, { FC } from 'react';
import { Box, Button, InputWrapper, TextInput, Stack } from '@mantine/core';
import useInputState from "../../hooks/useInputState";

interface MiningFormProps {
  notifyFetchTranscript: (keyword: string) => Promise<void>;
}

const MiningForm: FC<MiningFormProps> = (props) => {
  const { notifyFetchTranscript } = props;
  const [keyword, handleChange, reset] = useInputState('');

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    notifyFetchTranscript(keyword);
    reset();
  };

  return (
    <Box sx={{ maxWidth: 350 }} mx="auto">
      <form onSubmit={(evt) => handleSubmit(evt)}>
        <label htmlFor='keyword'></label>
        <Stack justify="space-around">
          <InputWrapper
            id="input-demo"
            label="Search keyword"
            description="Please enter the keyword you want to search in this video"
          >
            <TextInput id="keyword" placeholder="keyword" onChange={handleChange} />
          </InputWrapper>
          <Button type="submit" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} radius="md" size="sm">Mine</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default MiningForm;
