import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { SignupPage } from "../features/auth/SignupPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { MarketingPage } from "../features/marketing/MarketingPage";
import { EditorReviewPage } from "../features/editor/pages/EditorReviewPage";
import { EditorSummaryPage } from "../features/editor/pages/EditorSummaryPage";
import { NewScanPage } from "../features/scan/pages/NewScanPage";
import { ProcessingPage } from "../features/scan/pages/ProcessingPage";
import { ResultsPage } from "../features/scan/pages/ResultsPage";
import { ScanHistoryPage } from "../features/scan/pages/ScanHistoryPage";

export const router = createBrowserRouter([
  { path: "/", element: <MarketingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/scan/new", element: <NewScanPage /> },
  { path: "/scan/processing/:scanId", element: <ProcessingPage /> },
  { path: "/scan/results/:scanId", element: <ResultsPage /> },
  { path: "/scan/history", element: <ScanHistoryPage /> },
  { path: "/scan/editor/:scanId", element: <EditorReviewPage /> },
  { path: "/scan/editor/:scanId/summary", element: <EditorSummaryPage /> }
]);
