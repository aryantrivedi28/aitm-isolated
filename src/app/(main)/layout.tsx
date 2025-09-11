import Header from '@/src/components/Header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="py-32 bg-[#241C15]">
        {children}
      </main>
    </>
  )
}
