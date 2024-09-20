import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  if (result.score > 0) return 'Positive';
  if (result.score < 0) return 'Negative';
  return 'Neutral';
}

export function analyzeOverallSentiment(notes) {
  if (notes.length === 0) return 'No notes to analyze';
  
  const allText = notes.map(note => note.content).join(' ');
  const result = sentiment.analyze(allText);
  
  if (result.score > 0) return 'Overall Positive';
  if (result.score < 0) return 'Overall Negative';
  return 'Overall Neutral';
}
