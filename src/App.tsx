import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components/layout/Layout';
import { PageLoader } from '@/components/ui/PageLoader';
import { RouteTransition } from '@/components/ui/RouteTransition';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import './index.css';

// Lazy load pages for code splitting and better performance
const HomePage = lazy(() => import('@/components/pages/HomePage').then(module => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('@/components/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const WorksPage = lazy(() => import('@/components/pages/WorksPage').then(module => ({ default: module.WorksPage })));
const WorkDetailPage = lazy(() => import('@/components/pages/WorkDetailPage').then(module => ({ default: module.WorkDetailPage })));
const ContactPage = lazy(() => import('@/components/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Routes component with page transitions
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouteTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/works/:id" element={<WorkDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RouteTransition>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AudioPlayerProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AudioPlayerProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

