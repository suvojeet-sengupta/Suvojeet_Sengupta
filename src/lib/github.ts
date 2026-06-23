export interface GithubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

export async function fetchGithubRepo(owner: string, repo: string): Promise<GithubRepo | null> {
  const vpsUrl = process.env.GITHUB_STATS_API_URL || 'http://localhost:5003/api/github-stats';
  
  try {
    // Try fetching from the self-hosted cache service first to bypass GitHub rate limits
    const response = await fetch(`${vpsUrl}/${repo}`);
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (error: any) {
    console.warn(`VPS GitHub cache fetch failed for ${repo}, falling back to direct API:`, error.message);
  }

  // Fallback to direct GitHub API if VPS is unreachable
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repo directly: ${repo}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching GitHub data directly for ${repo}:`, error);
    return null;
  }
}
