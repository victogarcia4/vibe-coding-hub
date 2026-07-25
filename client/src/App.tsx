import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ArchitectProvider } from "./contexts/ArchitectContext";
import { I18nProvider } from "./i18n/I18nContext";
import Home from "./pages/Home";
import ResourceVault from "./pages/ResourceVault";
import ProjectArchitect from "./pages/ProjectArchitect";
import VibeCoding from "./pages/VibeCoding";
import WorkflowMap from "./pages/WorkflowMap";
import BriefingStudio from "./pages/BriefingStudio";
import DocumentViewer from "./pages/DocumentViewer";
import ProjectLibrary from "./pages/ProjectLibrary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vault" component={ResourceVault} />
      <Route path="/architect" component={ProjectArchitect} />
      <Route path="/vibe-coding" component={VibeCoding} />
      <Route path="/workflow" component={WorkflowMap} />
      <Route path="/studio" component={BriefingStudio} />
      <Route path="/documents" component={DocumentViewer} />
      <Route path="/projects" component={ProjectLibrary} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider defaultTheme="light" switchable>
          <ArchitectProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ArchitectProvider>
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
