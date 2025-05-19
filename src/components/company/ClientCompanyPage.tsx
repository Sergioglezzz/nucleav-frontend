"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import CompanyProfile, { type Company } from "@/components/company/CompanyProfile"
import { CircularProgress, Alert, Box } from "@mui/joy"

interface ClientCompanyPageProps {
  companyId: string
}

export default function ClientCompanyPage({ companyId }: ClientCompanyPageProps) {
  const { data: session, status } = useSession()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompany = async () => {
      if (status !== "authenticated" || !session?.accessToken) return

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        setCompany(response.data)
      } catch (err) {
        console.error(err)
        setError("No se pudo cargar la información de la empresa")
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [companyId, session, status])

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
    <CompanyProfile
      company={company}
      onBack={() => history.back()}
      onEdit={(updatedCompany) => setCompany(updatedCompany)}
      onDelete={() => {
        history.back()
      }}
    />
  )
}
