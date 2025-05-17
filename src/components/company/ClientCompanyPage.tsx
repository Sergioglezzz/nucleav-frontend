"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/joy";
import ColumnLayout from "@/components/ColumnLayout";
import CompanyProfile from "@/components/company/CompanyProfile";
import { useSession } from "next-auth/react";
import { useNotification } from "@/components/context/NotificationContext";

export default function ClientCompanyPage({ companyId }: { companyId: string }) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditCompany = (company: unknown) => {
    router.push(`/company`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteCompany = async (company: unknown) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification("Empresa eliminada correctamente", "success");
      router.push("/empresa");
    } catch (error) {
      console.error("Error al eliminar la empresa:", error);
      showNotification("No se pudo eliminar la empresa", "error");
    }
  };

  if (status === "loading") {
    return (
      <ColumnLayout>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress
            size="lg"
            sx={{
              "--CircularProgress-trackColor": "rgba(255, 188, 98, 0.2)",
              "--CircularProgress-progressColor": "#ffbc62",
            }}
          />
        </Box>
      </ColumnLayout>
    );
  }

  return (
    <ColumnLayout>
      <CompanyProfile
        companyId={companyId}
        onBack={() => router.push("/empresa")}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany}
      />
    </ColumnLayout>
  );
}
