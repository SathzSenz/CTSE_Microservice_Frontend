export async function updateMood(mood: string, token: string) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/mood`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ mood })
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update mood")
  }

  return res.json()
}