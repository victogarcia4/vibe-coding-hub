import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ResourceVault from "./pages/ResourceVault";
import ProjectArchitect from "./pages/ProjectArchitect";
import VibeCoding from "./pages/VibeCoding";
import WorkflowMap from "./pages/WorkflowMap";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vault" component={ResourceVault} />
      <Route path="/architect" component={ProjectArchitect} />
      <Route path="/vibe-coding" component={VibeCoding} />
      <Route path="/workflow" component={WorkflowMap} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
