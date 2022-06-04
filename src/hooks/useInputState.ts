import { useState } from "react";

type UseInputStateResponse = [
  string,
  (evt: React.ChangeEvent<HTMLInputElement>) => void,
  () => void
];

const useInputState = (initialValue: string): UseInputStateResponse => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  };

  const reset = () => {
    setValue('');
  }

  return [value, handleChange, reset];
};

export default useInputState;
