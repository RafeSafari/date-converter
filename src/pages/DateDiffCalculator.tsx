import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import DateFields from "components/DateFields";
import CALENDARS from "calendars";
import { useCalendarDate } from "hooks/useCalendarDate";
import moment from "moment";
import { thousandSep } from "utils";

const DateDiffCalculator = () => {
  const source = useCalendarDate(new Date());
  const target = useCalendarDate(new Date(Date.now() + 7 * 86_400_000), CALENDARS[1]);

  const diffDays = useMemo<number>(() => {
    return moment(source.date).diff(target.date, "days");
  }, [target.date, source.date]);

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 4 },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <title>محاسبه فاصله دو تاریخ</title>

      {/* input box */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          textAlign: "center",
          padding: { xs: 2, sm: 4 },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          maxWidth: 1000,
        }}
      >
        <DateFields label="تاریخ مبدأ" value={source} />
        <DateFields label="تاریخ مقصد" value={target} />
      </Box>

      {/* result box */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          textAlign: "center",
          padding: { xs: 2, sm: 4 },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          maxWidth: 1000,
        }}
      >
        {/* Results */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            key={source.calendar.name}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              columnGap: ".35rem",
              rowGap: { xs: ".5rem", sm: ".25rem" },
              width: "100%",
            }}
          >
            {!new source.calendar.component(source.date).isValid() || !new target.calendar.component(target.date).isValid() ? (
              <Typography variant="h6">
                <Typography variant="caption" color="warning">
                  غیر قابل محاسبه!
                </Typography>
              </Typography>
            ) : (
              <>
                <Box sx={{ display: "inline-flex", alignItems: "baseline", gap: ".25rem", whiteSpace: "nowrap" }}>
                  {new source.calendar.component(source.date)
                    .getParts()
                    .reverse()
                    .map((part, i) => (
                      <Typography key={i}>{part}</Typography>
                    ))}
                  <Typography variant="caption" color="text.secondary">(مبدأ)</Typography>
                </Box>

                <Box sx={{ display: "inline-flex", alignItems: "baseline", gap: ".25rem", whiteSpace: "nowrap" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                    {diffDays === 0
                      ? "برابر با"
                      : `${thousandSep(Math.abs(diffDays))} روز ${diffDays < 0 ? "قبل" : "بعد"}`}
                  </Typography>
                  <Typography>از</Typography>
                </Box>

                <Box sx={{ display: "inline-flex", alignItems: "baseline", gap: ".25rem", whiteSpace: "nowrap" }}>
                  {new target.calendar.component(target.date)
                    .getParts()
                    .reverse()
                    .map((part, i) => (
                      <Typography key={i}>{part}</Typography>
                    ))}
                  <Typography variant="caption" color="text.secondary">(مقصد)</Typography>
                </Box>

                <Typography>است</Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* other links */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          textAlign: "center",
          padding: { xs: 2, sm: 4 },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          maxWidth: 1000,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
              gap: 1,
            }}
          >
            <Typography variant="h6" component="h6" width="100%">
              دیگر ابزار ها
            </Typography>
            <Button variant="text" color="primary" component={Link} to="/conv" sx={{ paddingInlineEnd: 1 }}>
              تبدیل تاریخ
            </Button>
            <Button variant="text" color="primary" component={Link} to="/Export" sx={{ paddingInlineEnd: 1 }}>
              خروجی بازه تاریخ
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DateDiffCalculator;
