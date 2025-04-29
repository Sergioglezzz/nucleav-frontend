"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Avatar, Card, CardContent, Typography, Divider, Skeleton, Chip, Button, Stack, Box } from "@mui/joy"
import { Edit, Mail, CalendarMonth, LocationOn, Work } from "@mui/icons-material"
import Navbar from "@/components/Navbar"
import ColumnLayout from "@/components/ColumnLayout"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <ProfileSkeleton />
  }

  const user = session?.user
  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "?"

  return (
    <>
      <Navbar />
      <ColumnLayout>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography level="h1">User Profile</Typography>
          <Button
            variant="outlined"
            size="sm"
            startDecorator={<Edit />}
            onClick={() => router.push('/profile/edit')}
          >
            Edit Profile
          </Button>
        </Box>

        <Card sx={{ maxWidth: 600, mx: "auto", boxShadow: "md" }}>
          <Box sx={{ position: "relative", pb: 0 }}>
            <Box
              sx={{
                height: 128,
                width: "100%",
                background: "linear-gradient(to right, var(--joy-palette-primary-500), var(--joy-palette-primary-600))",
                borderTopLeftRadius: "var(--joy-radius-lg)",
                borderTopRightRadius: "var(--joy-radius-lg)",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 8,
              }}
            >
              <Avatar
                src={user?.image || ""}
                alt={user?.name || "User"}
                sx={{
                  width: 96,
                  height: 96,
                  border: "4px solid var(--joy-palette-background-surface)",
                  bgcolor: "primary.500",
                  color: "primary.contrastText",
                  fontSize: "xl2",
                }}
              >
                {userInitials}
              </Avatar>
              <Typography level="h2" sx={{ mt: 2 }}>
                {user?.name}
              </Typography>
              <Typography level="body-md" color="neutral">
                {user?.email}
              </Typography>
              <Chip variant="outlined" size="sm" sx={{ mt: 1 }}>
                {user?.role || "User"}
              </Chip>
            </Box>
          </Box>
          <CardContent sx={{ pt: 3, pb: 3, px: 3 }}>
            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Mail sx={{ color: "text.tertiary" }} />
                <Box>
                  <Typography level="body-sm" fontWeight="lg">
                    Email
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Work sx={{ color: "text.tertiary" }} />
                <Box>
                  <Typography level="body-sm" fontWeight="lg">
                    Role
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    {user?.role || "User"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CalendarMonth sx={{ color: "text.tertiary" }} />
                <Box>
                  <Typography level="body-sm" fontWeight="lg">
                    Member since
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    January 2023
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocationOn sx={{ color: "text.tertiary" }} />
                <Box>
                  <Typography level="body-sm" fontWeight="lg">
                    Location
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    New York, USA
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography level="title-md">Account Settings</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <Button variant="outlined" size="sm">
                  Change Password
                </Button>
                <Button variant="outlined" size="sm">
                  Notification Settings
                </Button>
                <Button variant="outlined" size="sm">
                  Privacy Settings
                </Button>
                <Button variant="outlined" size="sm">
                  Connected Accounts
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </ColumnLayout>
    </>
  )
}

function ProfileSkeleton() {
  return (
    <>
      <Box sx={{ height: 56 }}></Box> {/* Navbar placeholder */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Skeleton variant="rectangular" width={160} height={40} />
          <Skeleton variant="rectangular" width={128} height={36} />
        </Box>

        <Card sx={{ maxWidth: 600, mx: "auto" }}>
          <Box sx={{ position: "relative", pb: 0 }}>
            <Skeleton
              variant="rectangular"
              height={128}
              sx={{
                width: "100%",
                borderTopLeftRadius: "var(--joy-radius-lg)",
                borderTopRightRadius: "var(--joy-radius-lg)",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 8,
              }}
            >
              <Skeleton variant="circular" width={96} height={96} />
              <Skeleton variant="rectangular" width={192} height={32} sx={{ mt: 2 }} />
              <Skeleton variant="rectangular" width={256} height={16} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" width={80} height={20} sx={{ mt: 1 }} />
            </Box>
          </Box>
          <CardContent sx={{ pt: 3, pb: 3, px: 3 }}>
            <Skeleton variant="rectangular" height={1} sx={{ width: "100%", my: 3 }} />

            <Stack spacing={3}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Box>
                    <Skeleton variant="rectangular" width={80} height={16} />
                    <Skeleton variant="rectangular" width={160} height={16} sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
              ))}
            </Stack>

            <Skeleton variant="rectangular" height={1} sx={{ width: "100%", my: 3 }} />

            <Skeleton variant="rectangular" width={160} height={24} sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height={36} sx={{ width: "100%" }} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
