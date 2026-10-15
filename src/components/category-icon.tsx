import { cn } from "@/lib/utils";
import {
  BookOpen,
  Boxes,
  Braces,
  Bug,
  Database,
  Folder,
  GitBranch,
  List,
  MessageSquare,
  Microscope,
  Package,
  Play,
  Server,
  Shapes,
  ShieldAlert,
  Tag,
  Terminal,
  Wrench,
  Archive,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  package: Package,
  shapes: Shapes,
  braces: Braces,
  microscope: Microscope,
  server: Server,
  bug: Bug,
  list: List,
  "book-open": BookOpen,
  folder: Folder,
  "git-branch": GitBranch,
  "shield-alert": ShieldAlert,
  wrench: Wrench,
  "message-square": MessageSquare,
  tag: Tag,
  terminal: Terminal,
  play: Play,
  archive: Archive,
  database: Database,
};

/** Tamanhos padronizados: inline (16), card header (20), hero/empty (24). */
const SIZES = { sm: "size-4", md: "size-5", lg: "size-6" } as const;

export function CategoryIcon({
  icon,
  className,
  size = "sm",
}: {
  icon: string;
  className?: string;
  size?: keyof typeof SIZES;
}) {
  const Icon = ICONS[icon] ?? Boxes;
  return <Icon className={cn(SIZES[size], className)} aria-hidden="true" />;
}
