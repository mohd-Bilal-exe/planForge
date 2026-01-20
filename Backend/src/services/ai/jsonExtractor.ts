export default function extractJsonBlock(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI response');
  }

  const trimmed = text.trim();

  // Brace matching to extract the first full JSON object
  let braceCount = 0;
  let startIndex = -1;
  let endIndex = -1;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if (char === '{') {
      if (startIndex === -1) startIndex = i;
      braceCount++;
    }

    if (char === '}') {
      braceCount--;
      if (braceCount === 0 && startIndex !== -1) {
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Incomplete JSON object from AI');
  }

  const jsonString = trimmed.slice(startIndex, endIndex + 1);

  // Validate early
  JSON.parse(jsonString);

  return jsonString;
}
