import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"
import { useTheme } from "../../hooks/useTheme"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-slate-900/95 !text-white !border-white/[0.12] !shadow-2xl !shadow-black/40 backdrop-blur-xl rounded-xl",
          title: "!text-white/90 !font-medium",
          description: "!text-white/55",
          success: "!border-l-4 !border-l-emerald-500/70",
          error: "!border-l-4 !border-l-red-500/70",
          warning: "!border-l-4 !border-l-amber-500/70",
          info: "!border-l-4 !border-l-blue-500/70",
          actionButton: "!bg-white/10 !text-white hover:!bg-white/20",
          cancelButton: "!bg-white/5 !text-white/60 hover:!bg-white/10",
          closeButton: "!bg-white/5 !text-white/50 hover:!bg-white/10 hover:!text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
