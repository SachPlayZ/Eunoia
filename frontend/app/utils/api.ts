export async function analyzePersonality(data: { question: string; answer: string }[]) {
    const response = await fetch('/api/analyze-personality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze personality');
    }
  
    return response.json();
  }