export default async function handler(req, res) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}&hydrate=linescore,probablePitcher`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({
      ok: true,
      source: "Official MLB Stats API",
      date: today,
      games: data?.dates?.[0]?.games || [],
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
