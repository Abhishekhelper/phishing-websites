export async function getSafetyAdvice(message: string, history: any[]) {
  const response = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });

  if (!response.ok) {
    throw new Error('Assistant API failed');
  }

  const data = await response.json();
  return data.text;
}
