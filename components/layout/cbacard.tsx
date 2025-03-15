import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface NeumorphicCardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
}

export function NeumorphicCard({ children, className, elevated = false }: NeumorphicCardProps) {
  return (
    <Card 
      className={cn(
        "bg-white dark:bg-gray-800 border-none",
        elevated 
          ? "shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(30,30,30,0.1)]"
          : "shadow-[4px_4px_8px_rgba(0,0,0,0.06),-4px_-4px_8px_rgba(255,255,255,0.6)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(30,30,30,0.1)]",
        className
      )}
    >
      {children}
    </Card>
  )
}

export { CardContent, CardFooter, CardHeader }