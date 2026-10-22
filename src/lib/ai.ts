export async function askPortfolioAI(
  question: string,
  history: {
    role: string;
    text: string;
  }[] = []
) {
  const response = await fetch(
    "/api/ask",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        question,
        history,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to contact AI backend"
    );
  }

  return response.json();
}
