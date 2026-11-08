"use client";

import { useEffect, useState } from "react";
import { Alert, Button } from "@mui/material";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!installEvent) {
    return null;
  }

  const install = async () => {
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <Alert
      severity="info"
      variant="filled"
      icon={<InstallMobileIcon />}
      action={
        <Button color="inherit" size="small" onClick={install}>
          نصب
        </Button>
      }
      sx={{
        width: "100%",
        borderRadius: 0,
        alignItems: "center",
        paddingX: { xs: 2, sm: 4 },
      }}
    >
      این برنامه را نصب کنید تا بدون اینترنت هم در دسترس باشد.
    </Alert>
  );
}
