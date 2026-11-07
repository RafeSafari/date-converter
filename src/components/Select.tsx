import React, { JSX, useEffect, useRef, useState } from "react";
import { FormControl, InputLabel, Select as MaterialSelect, MenuItem, SxProps } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { isEqualObjects } from "../utils";
import { useWheelStep } from "../hooks/useWheelStep";

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
  onStepBeyond?: (direction: 1 | -1) => void;
  value?: any;
  sx?: SxProps;
  size?: "small" | "medium";
}

const Select: React.FC<SelectProps> = ({ label, options, onChange, onStepBeyond, value = '', size = 'medium', sx = {} }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | ''>('');
  const selectRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: any) => {
    const index = Number(event?.target?.value);
    setSelectedIndex(index);
    if (!isNaN(index)) {
      onChange(options[index]?.value);
    } else {
      onChange(null);
    }
  };

  useWheelStep(selectRef, (direction) => {
    const currentIndex = options.findIndex(option => isEqualObjects(option.value, value));
    if (currentIndex === -1) {
      return;
    }
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= options.length) {
      onStepBeyond?.(direction);
      return;
    }
    setSelectedIndex(nextIndex);
    onChange(options[nextIndex].value);
  });

  useEffect(() => {
    setSelectedIndex(options.findIndex(option => isEqualObjects(option.value, value)));
  }, [value]);

  return (
    <CacheProvider value={cacheRtl}>
      <FormControl ref={selectRef} sx={sx}>
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
