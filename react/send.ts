export async function sendFeedback(feedback: string) {
  await fetch("/api/feedback", {
    method: "POST",
    body: JSON.stringify({
      title: feedback,
    }),
  });
}
