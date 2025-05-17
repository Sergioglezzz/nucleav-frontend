import ClientCompanyPage from "@/components/company/ClientCompanyPage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page(props: any) {
  return <ClientCompanyPage companyId={props.params.id} />;
}
