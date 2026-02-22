import { useState, useEffect, useCallback } from "react";

/**
 * useDataPolling - Agent Intelligence Data Polling Hook
 *
 * Core functionality:
 * 1. Poll backend API every 2 seconds for real-time data
 * 2. Detect new agent thoughts (by comparing IDs)
 * 3. Stream new thoughts one-by-one with delay (simulate real-time)
 * 4. Manage loading states and error handling
 * 5. Track context memory and system status
 */
export const useDataPolling = (pollInterval = 2000) => {
  const [data, setData] = useState(null);
  const [newThoughts, setNewThoughts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      // Try backend API first, fallback to static data.json
      let response;
      try {
        response = await fetch("http://localhost:8000/status", {
          signal: controller.signal,
          cache: "no-cache",
        });
      } catch (apiError) {
        console.log("Backend API unavailable, using static data");
        response = await fetch("./data.json", {
          signal: controller.signal,
          cache: "no-cache",
        });
      }
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newData = await response.json();

      // Validate data structure
      if (!newData.agent_thoughts || !Array.isArray(newData.agent_thoughts)) {
        throw new Error("Invalid data structure: missing agent_thoughts");
      }

      // Update sync_timestamp to current time for demo mode
      if (newData.meta) {
        newData.meta.sync_timestamp = new Date().toISOString();
      }

      // Restore user decisions from localStorage
      if (newData.execution?.current_proposal) {
        const proposalId = newData.execution.current_proposal.id;
        const savedDecision = localStorage.getItem(`proposal_${proposalId}_decision`);
        if (savedDecision) {
          newData.execution.current_proposal.human_decision = savedDecision;
          newData.execution.current_proposal.status =
            savedDecision === "approved" ? "EXECUTING" : "REJECTED";
        }
      }

      // Detect new thoughts
      if (data && data.agent_thoughts) {
        const currentLastId = data.agent_thoughts[0]?.id;
        const newThoughtsList = newData.agent_thoughts.filter(
          (thought) => thought.id > currentLastId,
        );

        // Stream new thoughts with stagger effect
        if (newThoughtsList.length > 0) {
          newThoughtsList.reverse().forEach((thought, index) => {
            setTimeout(() => {
              setNewThoughts((prev) => [thought, ...prev]);
            }, index * 2000); // 2 second delay between each thought
          });
        }
      }

      setData(newData);
      setError(null);
      setIsLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Data polling error:", err);

      // Handle different error types
      let errorMessage = err.message;
      if (err.name === "AbortError") {
        errorMessage = "Request timeout - retrying...";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      }

      setError(errorMessage);
      setRetryCount((prev) => prev + 1);

      // Only set loading to false after multiple retries
      if (retryCount > 3) {
        setIsLoading(false);
      }
    }
  }, [data, retryCount]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling interval
    const interval = setInterval(fetchData, pollInterval);

    return () => clearInterval(interval);
  }, [fetchData, pollInterval]);

  // Clear new thoughts after they've been displayed
  const clearNewThoughts = useCallback(() => {
    setNewThoughts([]);
  }, []);

  // Submit human feedback (stored in localStorage for now)
  const submitFeedback = useCallback((thoughtId, feedback) => {
    const feedbackData = JSON.parse(
      localStorage.getItem("agent_feedback") || "[]",
    );
    feedbackData.push({
      thought_id: thoughtId,
      feedback: feedback, // 'positive' or 'negative'
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("agent_feedback", JSON.stringify(feedbackData));

    // Update local state
    setData((prevData) => ({
      ...prevData,
      agent_thoughts: prevData.agent_thoughts.map((thought) =>
        thought.id === thoughtId
          ? { ...thought, human_feedback: feedback }
          : thought,
      ),
    }));
  }, []);

  // Approve or reject strategy proposal
  const handleProposal = useCallback((proposalId, decision) => {
    const proposalData = JSON.parse(
      localStorage.getItem("proposal_decisions") || "[]",
    );
    proposalData.push({
      proposal_id: proposalId,
      decision: decision, // 'approved' or 'rejected'
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("proposal_decisions", JSON.stringify(proposalData));

    // Update local state
    setData((prevData) => ({
      ...prevData,
      execution: {
        ...prevData.execution,
        current_proposal: {
          ...prevData.execution.current_proposal,
          human_decision: decision,
          status: decision === "approved" ? "EXECUTING" : "REJECTED",
        },
      },
    }));

    // Store the decision in a separate state to persist across polling
    localStorage.setItem(`proposal_${proposalId}_decision`, decision);
  }, []);

  return {
    data,
    newThoughts,
    isLoading,
    error,
    clearNewThoughts,
    submitFeedback,
    handleProposal,
    refetch: fetchData,
  };
};
