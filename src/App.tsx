import { Panel } from "@/components/pannel";
import { AppSidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen">
        <AppSidebar />
        <Panel />
      </div>
    </ThemeProvider>
  );
}

export default App;
