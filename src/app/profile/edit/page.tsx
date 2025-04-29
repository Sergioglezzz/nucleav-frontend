"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Input,
  Select,
  Option,
  Avatar,
  IconButton,
  Textarea,
  Stack,
  Sheet,
  LinearProgress,
} from "@mui/joy"
import {
  Edit,
  AccessTime,
  Upload,
  Description,
  Videocam,
  CheckCircle,
  Cancel,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
} from "@mui/icons-material"
import { SVGProps } from 'react';
import Navbar from "@/components/Navbar"
import { CssVarsProvider, extendTheme } from "@mui/joy/styles"

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#121212",
          surface: "#1e1e1e",
        },
        primary: {
          500: "#0078d4",
        },
      },
    },
  },
})

export default function ProfileEditPage() {
  const [firstName, setFirstName] = useState("First name")
  const [lastName, setLastName] = useState("Last name")
  const [role, setRole] = useState("UI Developer")
  const [email, setEmail] = useState("siriwat@test.com")
  const [country, setCountry] = useState("Thailand")
  const [timezone, setTimezone] = useState("Indochina Time (Bangkok) — GMT+07:00")
  const [bio, setBio] = useState(
    "I'm a software developer based in Bangkok, Thailand. My goal is to solve UI problems with neat CSS without using too much JavaScript.",
  )
  const [charCount, setCharCount] = useState(275)

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setBio(text)
    setCharCount(275 - text.length)
  }

  return (
    <>
      <Navbar />
      <CssVarsProvider theme={theme} defaultMode="dark">
        <Box
          sx={{
            bgcolor: "background.body",
            minHeight: "100vh",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: "800px",
            mx: "auto",
            mt: 8,
          }}
        >
          {/* Personal Info Section */}
          <Card
            variant="outlined"
            sx={{
              bgcolor: "background.surface",
              borderRadius: "md",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography level="title-lg" color="primary" sx={{ mb: 0.5 }}>
                Personal info
              </Typography>
              <Typography level="body-sm" sx={{ color: "text.tertiary", mb: 3 }}>
                Customize how your profile information will appear to the networks.
              </Typography>

              <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0tpS4KabQNuaGAGIYqn1ZjRN7Pnj7u.png"
                    alt="Profile"
                    sx={{ width: 80, height: 80, borderRadius: "50%" }}
                  />
                  <IconButton
                    size="sm"
                    variant="solid"
                    color="primary"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      borderRadius: "50%",
                      bgcolor: "primary.500",
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ width: "100%" }}>
                  <Typography level="body-sm" sx={{ mb: 1 }}>
                    Name
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      sx={{ flex: 1, bgcolor: "background.body" }}
                    />
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      sx={{ flex: 1, bgcolor: "background.body" }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="body-sm" sx={{ mb: 1 }}>
                        Role
                      </Typography>
                      <Input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        sx={{ width: "100%", bgcolor: "background.body" }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="body-sm" sx={{ mb: 1 }}>
                        Email
                      </Typography>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        startDecorator={<Mail fontSize="small" />}
                        sx={{ width: "100%", bgcolor: "background.body" }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography level="body-sm" sx={{ mb: 1 }}>
                  Country
                </Typography>
                <Select
                  value={country}
                  onChange={(_, value) => setCountry(value as string)}
                  sx={{ width: "100%", bgcolor: "background.body" }}
                >
                  <Option value="Thailand">Thailand</Option>
                  <Option value="United States">United States</Option>
                  <Option value="United Kingdom">United Kingdom</Option>
                  <Option value="Japan">Japan</Option>
                  <Option value="Singapore">Singapore</Option>
                </Select>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography level="body-sm" sx={{ mb: 1 }}>
                  Timezone
                </Typography>
                <Select
                  value={timezone}
                  onChange={(_, value) => setTimezone(value as string)}
                  startDecorator={<AccessTime fontSize="small" />}
                  sx={{ width: "100%", bgcolor: "background.body" }}
                >
                  <Option value="Indochina Time (Bangkok) — GMT+07:00">Indochina Time (Bangkok) — GMT+07:00</Option>
                  <Option value="Pacific Time (US & Canada) — GMT-08:00">Pacific Time (US & Canada) — GMT-08:00</Option>
                  <Option value="Eastern Time (US & Canada) — GMT-05:00">Eastern Time (US & Canada) — GMT-05:00</Option>
                  <Option value="Japan Standard Time — GMT+09:00">Japan Standard Time — GMT+09:00</Option>
                  <Option value="Singapore Time — GMT+08:00">Singapore Time — GMT+08:00</Option>
                </Select>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="plain" color="neutral">
                  Cancel
                </Button>
                <Button variant="solid" color="primary">
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card
            variant="outlined"
            sx={{
              bgcolor: "background.surface",
              borderRadius: "md",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography level="title-lg" color="primary" sx={{ mb: 0.5 }}>
                Bio
              </Typography>
              <Typography level="body-sm" sx={{ color: "text.tertiary", mb: 3 }}>
                Write a short introduction to be displayed on your profile
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1,
                    p: 1,
                    bgcolor: "background.body",
                    borderTopLeftRadius: "md",
                    borderTopRightRadius: "md",
                  }}
                >
                  <Select defaultValue="Normal text" size="sm" sx={{ minWidth: 120 }}>
                    <Option value="Normal text">Normal text</Option>
                    <Option value="Heading">Heading</Option>
                    <Option value="Subheading">Subheading</Option>
                  </Select>
                  <IconButton variant="plain" color="neutral" size="sm">
                    <FormatBold fontSize="small" />
                  </IconButton>
                  <IconButton variant="plain" color="neutral" size="sm">
                    <FormatItalic fontSize="small" />
                  </IconButton>
                  <IconButton variant="plain" color="neutral" size="sm">
                    <FormatUnderlined fontSize="small" />
                  </IconButton>
                  <IconButton variant="plain" color="neutral" size="sm">
                    <FormatListBulleted fontSize="small" />
                  </IconButton>
                </Box>
                <Textarea
                  value={bio}
                  onChange={handleBioChange}
                  minRows={4}
                  sx={{
                    width: "100%",
                    bgcolor: "background.body",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                />
                <Typography level="body-xs" sx={{ mt: 1, color: "text.tertiary" }}>
                  {charCount} characters left
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="plain" color="neutral">
                  Cancel
                </Button>
                <Button variant="solid" color="primary">
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Portfolio Projects Section */}
          <Card
            variant="outlined"
            sx={{
              bgcolor: "background.surface",
              borderRadius: "md",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography level="title-lg" color="primary" sx={{ mb: 0.5 }}>
                Portfolio projects
              </Typography>
              <Typography level="body-sm" sx={{ color: "text.tertiary", mb: 3 }}>
                Share a few snippets of your work.
              </Typography>

              <Sheet
                variant="outlined"
                sx={{
                  bgcolor: "background.level1",
                  borderRadius: "md",
                  p: 4,
                  mb: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "dashed",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <Upload sx={{ color: "primary.500" }} />
                </Box>
                <Typography level="body-sm" sx={{ color: "primary.500", mb: 0.5 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                  SVG, PNG, JPG or GIF (max. 800×400px)
                </Typography>
              </Sheet>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {/* Completed upload */}
                <Sheet
                  variant="outlined"
                  sx={{
                    bgcolor: "background.level1",
                    borderRadius: "md",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Description sx={{ color: "text.tertiary" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography level="body-sm">Tech design requirements.pdf</Typography>
                    <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                      200 kB
                    </Typography>
                    <LinearProgress
                      determinate
                      value={100}
                      sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: "background.level2" }}
                    />
                  </Box>
                  <Typography level="body-sm" sx={{ color: "success.500" }}>
                    100%
                  </Typography>
                  <CheckCircle sx={{ color: "success.500" }} />
                </Sheet>

                {/* In-progress upload */}
                <Sheet
                  variant="outlined"
                  sx={{
                    bgcolor: "background.level1",
                    borderRadius: "md",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Videocam sx={{ color: "text.tertiary" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography level="body-sm">Dashboard prototype recording.mp4</Typography>
                    <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                      16 MB
                    </Typography>
                    <LinearProgress
                      determinate
                      value={40}
                      sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: "background.level2" }}
                    />
                  </Box>
                  <Typography level="body-sm" sx={{ color: "primary.500" }}>
                    40%
                  </Typography>
                  <Cancel sx={{ color: "danger.500" }} />
                </Sheet>
              </Stack>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="plain" color="neutral">
                  Cancel
                </Button>
                <Button variant="solid" color="primary">
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </CssVarsProvider>
    </>
  )
}

// Missing icon import
function Mail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
