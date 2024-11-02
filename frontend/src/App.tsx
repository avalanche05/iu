import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { RequireAuth } from './auth/RequireAuth';
import { AuthProvider } from './auth/AuthProvider';
import { RequireUnauth } from './auth/RequireUnauth';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/toaster';
import { Pages } from './router/constants';
import Applications from './pages/Applications';
import Vacancies from './pages/Vacancies';
import Comparision from './pages/Comparision';
import Uploader from './pages/Uploader';
import Statistics from './pages/Statistics';
import InterviewFeedback from './pages/InterviewFeedback';

function App() {
    return (
        <>
            <Toaster />

            <AuthProvider>
                <Routes>
                    <Route
                        path={`/${Pages.Login}`}
                        element={
                            <RequireUnauth>
                                <Login />
                            </RequireUnauth>
                        }
                    />
                    <Route
                        path={`/${Pages.Applications}`}
                        element={
                            <RequireAuth>
                                <Dashboard>
                                    <Applications />
                                </Dashboard>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path={`/${Pages.Vacancies}`}
                        element={
                            <RequireAuth>
                                <Dashboard>
                                    <Vacancies />
                                </Dashboard>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path={`/${Pages.Comparision}`}
                        element={
                            <RequireAuth>
                                <Dashboard>
                                    <Comparision />
                                </Dashboard>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path={`/${Pages.Uploader}`}
                        element={
                            <RequireAuth>
                                <Dashboard>
                                    <Uploader />
                                </Dashboard>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path={`/${Pages.Statistics}`}
                        element={
                            <RequireAuth>
                                <Dashboard>
                                    <Statistics />
                                </Dashboard>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path={`/${Pages.InterviewFeedback}`}
                        element={
                            <RequireAuth>
                                <Dashboard>
                                    <InterviewFeedback />
                                </Dashboard>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='*'
                        element={
                            <RequireAuth>
                                <Dashboard>
                                    <Applications />
                                </Dashboard>
                            </RequireAuth>
                        }
                    />
                </Routes>
            </AuthProvider>
        </>
    );
}

export default App;
