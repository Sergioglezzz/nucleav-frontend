import { Box } from "@mui/joy"
import ColumnLayout from "@/components/ColumnLayout"
import ClientCompanyPage from "@/components/company/ClientCompanyPage"

export default function CompanyPage({ params }: { params: { id: string } }) {
  return (
    <ColumnLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, sm: 3 } }}>
        <ClientCompanyPage companyId={params.id} />
      </Box>
    </ColumnLayout>
  )
}
