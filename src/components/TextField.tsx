import React, { useEffect, useRef, useState } from "react";
import { FormControl, TextField as MaterialTextField, SxProps } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { useWheelStep } from "../hooks/useWheelStep";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

interface InputProps {
  label: string;
  type: 'text'|'number';
  onChange: (value: any) => void;
  value?: any;
  sx?: SxProps;
  size?: "small" | "medium";
  reverseWheel?: boolean;
}

const TextField: React.FC<InputProps> = ({ label, type = "text", onChange, value = '', size = 'medium', sx = {}, reverseWheel = false }) => {

  const [inputValue, setInputValue] = useState<any>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: any) => {
    let value = event?.target?.value;
    if (type === 'number') {
      value = Number(value);
    }
    setInputValue(value);

    if (type === 'number') {
        if (!isNaN(value)) {
            onChange(value);
        }
    } else {
        onChange(value);
    }
  };

  useWheelStep(inputRef, (direction) => {
    const step: 1 | -1 = reverseWheel ? (direction === 1 ? -1 : 1) : direction;
    const current = Number(inputValue);
    const next = (Number.isFinite(current) ? current : 0) + step;
    setInputValue(next);
    onChange(next);
  }, type === 'number');

  useEffect(() => {
    setInputValue(value);
  }, [value])

  return (
    <CacheProvider value={cacheRtl}>
      <FormControl sx={sx}>
        <MaterialTextField
          label={label}
          inputRef={inputRef}
          onChange={handleChange}
          value={inputValue}
          sx={sx}
          type={type}
          inputMode={type === 'number' ? "numeric" : "text"}
          size={size === "small" ? "small" : "medium"}
          variant="outlined"
        />
      </FormControl>
    </CacheProvider>
  );
};

export default TextField;
