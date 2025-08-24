# Quadratic V2 (New Name Soon)

## Getting Started

```bash
npm install quadratic-v2

yarn add quadratic-v2

pnpm add quadratic-v2

bun add quadratic-v2
```

### Create a /api/feedback route

This will depend on your framework of choice. Here's a Next.js example:

```ts
// app/api/feedback/route.ts

import { createHandler } from "quadratic-v2/server";

export const POST = createHandler({
  apiKey: process.env.LINEAR_API_KEY!,
  teamId: process.env.LINEAR_TEAM_ID!,
});
```

### Add the feedback widget to your app

```tsx
// app/page.tsx

import "quadratic-v2/style.css";
import { FeedbackWidget } from "quadratic-v2/react";

export default function Home() {
  return (
    <FeedbackWidget>
      <button>Feedback</button>
    </FeedbackWidget>
  );
}
```