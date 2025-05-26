"use client"

import { Box, Card, CardContent, Typography } from "@mui/joy"
import { useColorScheme } from "@mui/joy/styles"

interface ChartData {
  label: string
  value: number
  color: string
}

interface StatsChartProps {
  title: string
  data: ChartData[]
  total: number
}

export default function StatsChart({ title, data, total }: StatsChartProps) {
  const { mode } = useColorScheme()

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <Card
      variant="outlined"
      sx={{
        background:
          mode === "dark"
            ? "linear-gradient(145deg, rgba(45,45,45,0.7) 0%, rgba(35,35,35,0.4) 100%)"
            : "linear-gradient(145deg, rgba(250,250,250,0.8) 0%, rgba(240,240,240,0.4) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      }}
    >
      <CardContent>
        <Typography level="title-md" sx={{ mb: 2, color: "#ffbc62" }}>
          {title}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography level="h2" sx={{ mb: 1 }}>
            {total}
          </Typography>
          <Typography level="body-sm" color="neutral">
            Total
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {data.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography level="body-sm">{item.label}</Typography>
                <Typography level="body-sm" fontWeight="lg">
                  {item.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 8,
                  bgcolor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    height: "100%",
                    bgcolor: item.color,
                    borderRadius: 4,
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
