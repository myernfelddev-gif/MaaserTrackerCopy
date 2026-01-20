
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, RootState } from './store';

// Pages
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupProjects from './pages/GroupProjects';
import ProjectDetails from './pages/ProjectDetails';
import Login from './pages/Login';

// Components
import Layout from './components/layout/Layout';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="groups" element={<Groups />} />
              <Route path="groups/:groupId" element={<GroupProjects />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
