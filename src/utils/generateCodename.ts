const adjectives = ['Silent', 'Crimson', 'Shadow', 'Ghost', 'Iron', 'Phantom', 'Dark'];
const nouns = ['Nightingale', 'Kraken', 'Falcon', 'Viper', 'Raven', 'Wraith', 'Spectre'];

export function generateCodename(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `The ${adjective} ${noun}`;
}
