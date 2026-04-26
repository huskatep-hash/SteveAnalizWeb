import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPostDetail from "@/pages/BlogPostDetail";
import Education from "@/pages/Education";
import EducationDetail from "@/pages/EducationDetail";
import Writer from "@/pages/Writer";
import Vision from "@/pages/Vision";
import Watchlist from "@/pages/Watchlist";
import SteveAnalizAI from "@/pages/SteveAnalizAI";
import News from "@/pages/News";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPostDetail} />
        <Route path="/news" component={News} />
        <Route path="/education" component={Education} />
        <Route path="/education/:slug" component={EducationDetail} />
        <Route path="/writer" component={Writer} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/ai" component={SteveAnalizAI} />
        <Route path="/about" component={Vision} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
