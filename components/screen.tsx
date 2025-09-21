interface ScreenProps {
  children: React.ReactNode
}

export function Screen({ children }: ScreenProps) {
  return <div className="mx-[60px] bg-[#F4F3EC] dark:bg-[#1A1A1A] relative z-10 h-screen flex flex-col">{children}</div>
}
