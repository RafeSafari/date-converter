import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, TextField as MaterialTextField, SxProps } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";

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
}

const TextField: React.FC<InputProps> = ({ label, type = "text", onChange, value = '', size = 'medium', sx = {} }) => {

  const [inputValue, setInputValue] = useState<any>('');
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

  useEffect(() => {
    setInputValue(value);
  }, [value])

  return (
    <CacheProvider value={cacheRtl}>
      <FormControl sx={sx}>
        <MaterialTextField
          label={label}
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
