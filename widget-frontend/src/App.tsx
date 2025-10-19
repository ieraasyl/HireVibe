import { useEffect, useState } from "react";
import { Chatbot } from "./features/chat/ui/chatbot";
import apiConfig from "./config/api";

function App() {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastApplicationWithWait = async () => {
      try {
        setLoading(true);

        // Try up to 4 times (~10 seconds total with backoff) to wait for parsing/analysis to finish
        const maxAttempts = 4;
        const intervalMs = 3000; // 3s

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          const response = await fetch(
            `${apiConfig.baseUrl}/api/applications?limit=1&skip=0`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch applications: ${response.statusText}`);
          }

          const applications = await response.json();

          if (applications.length === 0) {
            setError("No applications found");
            break;
          }

          const app = applications[0];

          // If resume_parsed or matching_sections are present, we're done
          if (app.resume_parsed || app.matching_sections) {
            setApplication(app);
            return;
          }

          // If this was the last attempt, set application anyway
          if (attempt === maxAttempts) {
            setApplication(app);
            return;
          }

          // Wait before retrying
          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, intervalMs));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch application");
        console.error("Error fetching last application:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastApplicationWithWait();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!application) {
    return <div className="flex items-center justify-center h-screen">No application available</div>;
  }

  return <Chatbot application={application} />;
}

export default App;
