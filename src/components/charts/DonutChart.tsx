"use client"

import { Box, Card, CardContent, Typography } from "@mui/joy"
import { useColorScheme } from "@mui/joy/styles"

interface DonutData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  title: string
  data: DonutData[]
  centerText?: string
  centerValue?: string | number
}

export default function DonutChart({ title, data, centerText, centerValue }: DonutChartProps) {
  const { mode } = useColorScheme()

  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Calculate angles for each segment
  let currentAngle = 0
  const segments = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    }
    currentAngle += angle
    return segment
  })

  const radius = 60
  const strokeWidth = 12
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI

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
        <Typography level="title-md" sx={{ mb: 3, color: "#ffbc62" }}>
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Donut Chart */}
          <Box sx={{ position: "relative" }}>
            <svg width={radius * 2} height={radius * 2}>
              {segments.map((segment, index) => {
                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
                const strokeDashoffset = -((segment.startAngle / 360) * circumference)

                return (
                  <circle
                    key={index}
                    stroke={segment.color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                      transformOrigin: "50% 50%",
                      transform: "rotate(-90deg)",
                      transition: "stroke-dasharray 0.3s ease",
                    }}
                  />
                )
              })}
            </svg>

            {/* Center text */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography level="h3" sx={{ lineHeight: 1 }}>
                {centerValue || total}
              </Typography>
              <Typography level="body-xs" color="neutral">
                {centerText || "Total"}
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ flex: 1 }}>
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: item.color,
                    }}
                  />
                  <Typography level="body-sm">{item.label}</Typography>
                </Box>
                <Typography level="body-sm" fontWeight="lg">
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
