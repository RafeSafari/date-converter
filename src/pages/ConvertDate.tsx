import { Box, Typography } from '@mui/material';
import DateFields from "components/DateFields";
import ToolLinks from "components/ToolLinks";
import CALENDARS from "calendars";
import { useCalendarDate } from "hooks/useCalendarDate";

const ConvertDate = () => {
  const source = useCalendarDate(new Date());
  const selectedDate = source.date;

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: "column",
        gap: { xs: 2, sm: 4 },
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <title>تبدیل تاریخ</title>

      {/* input box */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center', 
          padding: { xs: 2, sm: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 1000,
        }}
      >
        <DateFields label="تقویم منبع" value={source} />
      </Box>
      
      {/* result box */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center', 
          padding: { xs: 2, sm: 4 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 1000,
        }}
      >
        {/* Results */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}>
          {CALENDARS.filter(calendar => calendar.name !== source.calendar.name).map(calendar => (
            <Box key={calendar.name} sx={{display: "flex", flexDirection: "row", gap: 1}}>
              <Typography variant="h6">
                {calendar.title}{calendar.title_alt ? <Typography variant="caption"> ({calendar.title_alt})</Typography>: ''}:
              </Typography>
              {new calendar.component(selectedDate).isValid() ?
                new calendar.component(selectedDate).getParts().reverse().map((part, i) => (
                  <Typography key={i} variant="h6">{part}</Typography>
                ))
              :
              <Typography variant="h6">
                <Typography variant="caption" color="warning">غیر قابل محاسبه!</Typography>
              </Typography>
              }
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* other links */}
      <ToolLinks current="conv" />
    </Box>
  );
};

export default ConvertDate;
