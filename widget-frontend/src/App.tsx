import { useEffect, useState } from "react";
import { Chatbot } from "./features/chat/ui/chatbot";
import apiConfig from "./config/api";

function App() {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastApplication = async () => {
      try {
        setLoading(true);
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

        if (applications.length > 0) {
          setApplicationId(applications[0].id);
        } else {
          setError("No applications found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch application");
        console.error("Error fetching last application:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastApplication();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!applicationId) {
    return <div className="flex items-center justify-center h-screen">No application available</div>;
  }

  return <Chatbot applicationId={applicationId} />;
}

export default App;
