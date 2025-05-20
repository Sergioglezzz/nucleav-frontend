"use client"

import { use, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import ColumnLayout from "@/components/ColumnLayout"
import CompanyProfile, { type Company } from "@/components/company/CompanyProfile"
import { CircularProgress, Alert, Box } from "@mui/joy"

// Usamos la interfaz generada implícitamente por Next.js
export default function Page({ params }: { params: Promise<{ cif: string }> }) {
  const { cif } = use(params)

  const { data: session, status } = useSession()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompany = async () => {
      if (status !== "authenticated" || !session?.accessToken || !cif) return

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/companies/${cif}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        )

        setCompany(response.data)
      } catch (err) {
        console.error(err)
        setError("No se pudo cargar la información de la empresa")
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [cif, session, status])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>
  }

  if (!company) {
    return <Alert color="warning">Empresa no encontrada</Alert>
  }

  return (
    <ColumnLayout>
      <CompanyProfile
        company={company}
        onBack={() => history.back()}
        onEdit={(updatedCompany) => setCompany(updatedCompany)}
        onDelete={() => history.back()}
      />
    </ColumnLayout>
  )
}
