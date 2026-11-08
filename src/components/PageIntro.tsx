"use client";

import { Box, Typography } from "@mui/material";

type PageIntroProps = {
  title: string;
  description: string;
};

export default function PageIntro({ title, description }: PageIntroProps) {
  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        maxWidth: 1000,
        padding: { xs: 2, sm: 4 },
        paddingBottom: 0,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Typography component="p" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
