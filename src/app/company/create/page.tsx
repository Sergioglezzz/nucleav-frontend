"use client"
import { Box } from "@mui/joy"
import ColumnLayout from "@/components/ColumnLayout"
import CreateCompanyPage from "@/app/company/components/CreateCompanyPage"

export default function Page() {
  return (
    <ColumnLayout>
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 0.3, sm: 3 } }}>
        <CreateCompanyPage />
      </Box>
    </ColumnLayout>
  )
}
