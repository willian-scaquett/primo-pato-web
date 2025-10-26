import React from "react";
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from "@mui/material";

export const MetricCard = ({ title, value, color, chipTextColor }) => {
  const safeValue = Math.max(0, Math.min(100, value));
  
  return (
    <Card sx={{ backgroundColor: "#1A2C2C", border: "1px solid #00E0B7" }}>
      <CardContent>
        <Typography variant="body1" sx={{ color: "#FFFFFF", mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={safeValue}
              sx={{
                height: 10,
                borderRadius: 6,
                backgroundColor: "#2A3C3C",
                "& .MuiLinearProgress-bar": { backgroundColor: color }
              }}
            />
          </Box>
          <Chip
            label={`${value.toFixed(0)}%`}
            sx={{
              backgroundColor: color,
              color: chipTextColor || "#0A1C1C",
              fontWeight: "bold"
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};