import { prisma } from '../config/prisma';

const adjectives = [
'Silent', 'Crimson', 'Shadow', 'Ghost', 'Iron', 'Phantom', 'Dark', 'Cunning', 'Swift', 'Vigilant',
'Evasive', 'Stealthy', 'Brave', 'Fierce', 'Loyal', 'Merciless', 'Tactical', 'Wicked', 'Deadly', 'Elusive'
];

export async function generateCodename(): Promise<string> {
  // Step 1: Get used adjectives from the DB
  const used = await prisma.gadget.findMany({
    select: { codeName: true },
  });

  const usedAdjectives = new Set(
    used
      .map(({ codeName }) => {
        const match = codeName.match(/^The (\w+)/); // matches "The Silent", "The Ghost v2"
        return match?.[1];
      })
      .filter(Boolean)
  );

  // Step 2: Try to pick an unused adjective first
  const unused = adjectives.filter(adj => !usedAdjectives.has(adj));

  if (unused.length > 0) {
    const adjective = unused[Math.floor(Math.random() * unused.length)];
    return `The ${adjective}`;
  }

  // Step 3: All adjectives used — find next version
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  let version = 2;
  let candidate = `The ${adjective} v${version}`;

  const existingNames = new Set(used.map(u => u.codeName));
  while (existingNames.has(candidate)) {
    version++;
    candidate = `The ${adjective} v${version}`;
  }

  return candidate;
}
