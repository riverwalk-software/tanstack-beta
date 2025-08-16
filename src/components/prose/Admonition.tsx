import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AdmonitionType = "note" | "tip" | "caution" | "danger" | "success";

const variantMap: Record<
  AdmonitionType,
  {
    icon: React.ComponentType<any>;
    className: string;
  }
> = {
  note: {
    icon: Info,
    className:
      "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-100",
  },
  tip: {
    icon: Lightbulb,
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100",
  },
  caution: {
    icon: AlertTriangle,
    className:
      "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100",
  },
  danger: {
    icon: AlertCircle,
    className:
      "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-100",
  },
  success: {
    icon: CheckCircle2,
    className:
      "border-green-300 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-100",
  },
};

export function Admonition({
  type,
  title,
  children,
}: {
  type: AdmonitionType;
  title: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, className } = variantMap[type];
  return (
    <Alert className={`${className} border`}>
      <Icon className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
