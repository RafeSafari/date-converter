import React, { JSX, useEffect, useState } from "react";
import { FormControl, InputLabel, Select as MaterialSelect, MenuItem, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { isEqualObjects } from "../utils";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

interface Option {
  title: string | JSX.Element;
  value: any;
}

interface SelectProps {
  label: string;
  options: Option[];
  onChange: (value: any) => void;
  value?: any;
  sx?: SxProps;
  size?: "small" | "medium";
}

const Select: React.FC<SelectProps> = ({ label, options, onChange, value = '', size = 'medium', sx = {} }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | ''>('');

  const handleChange = (event: any) => {
    const index = Number(event?.target?.value);
    setSelectedIndex(index);
    if (!isNaN(index)) {
      onChange(options[index]?.value);
    } else {
      onChange(null);
    }
  };

  useEffect(() => {
    setSelectedIndex(options.findIndex(option => isEqualObjects(option.value, value)));
  }, [value]);

  return (
    <CacheProvider value={cacheRtl}>
      <FormControl sx={sx}>
        <InputLabel size={size === "small" ? "small" : "normal"} id="multiple-select-label">
          {label}
        </InputLabel>
        <MaterialSelect
          label={label}
          onChange={handleChange}
          value={selectedIndex}
          sx={{
            ...sx,
            textAlign: "left",
          }}
          variant="outlined"
          size={size === "small" ? "small" : "medium"}
        >
          {options.map((option, i) => (
            <MenuItem key={i} value={i} sx={{ justifyContent: 'flex-end' }}>
              {option.title}
            </MenuItem>
          ))}
        </MaterialSelect>
      </FormControl>
    </CacheProvider>
  );
};

export default Select;
