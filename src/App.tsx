import { Panel } from "@/components/pannel";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen">
        <Sidebar />
        <Panel />
      </div>
    </ThemeProvider>
  );
}

export default App;
