import AppSidebar from "@/components/dashboard/sidebar";
import AppHeader from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 flex flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
      <footer className="py-2 px-4 text-center text-xs text-muted-foreground border-t">
        Limpopo Guardian: Simple for Citizens. Powerful for Government.
      </footer>
    </div>
  );
}
