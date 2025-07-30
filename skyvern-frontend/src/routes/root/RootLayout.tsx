import { Toaster } from "@/components/ui/toaster";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/util/utils";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useDebugStore } from "@/store/useDebugStore";

function RootLayout() {
  const collapsed = useSidebarStore((state) => state.collapsed);
  const embed = new URLSearchParams(window.location.search).get("embed");
  const isEmbedded = embed === "true";
  const debugStore = useDebugStore();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {!isEmbedded && <Sidebar />}
      
      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          !isEmbedded && (collapsed ? "lg:ml-18" : "lg:ml-60"),
          isEmbedded && "ml-0"
        )}
      >
        <Header />
        {/* Main View */}
        <main className={cn(
          "flex-1 flex flex-col min-h-0",
          debugStore.isDebugMode ? "pb-0" : "pb-4"
        )}>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export { RootLayout };
