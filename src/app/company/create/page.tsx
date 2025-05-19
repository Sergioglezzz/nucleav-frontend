"use client"
import { Box } from "@mui/joy"
import ColumnLayout from "@/components/ColumnLayout"
import CreateCompanyPage from "@/components/company/CreateCompanyPage"

export default function Page() {
  return (
    <ColumnLayout>
      <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 3 } }}>
        <CreateCompanyPage />
      </Box>
    </ColumnLayout>
  )
}
