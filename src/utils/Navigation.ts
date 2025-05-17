import {
  FolderSpecial as ProjectIcon,
  People as NetworkIcon,
  Inventory as MaterialIcon,
  Business as CompanyIcon,
  Home as HomeIcon,
} from "@mui/icons-material"

export const navigationItems = [
  { name: "Inicio", path: "/dashboard", icon: HomeIcon },
  { name: "Proyectos", path: "/project", icon: ProjectIcon },
  { name: "Red", path: "/network", icon: NetworkIcon },
  { name: "Material", path: "/material", icon: MaterialIcon },
  { name: "Empresa", path: "/company", icon: CompanyIcon },
]
