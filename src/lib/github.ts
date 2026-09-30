export interface GithubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

export async function fetchGithubRepo(owner: string, repo: string): Promise<GithubRepo | null> {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.suvojeetsengupta.in').replace(/\/+$/, '');

  try {
    // Backend caches GitHub responses to avoid rate limits
    const response = await fetch(`${apiBase}/api/public/github-repo/${owner}/${repo}`, {
      next: { revalidate: 86400 } // 24 hours in seconds
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error: any) {
    console.warn(`Backend GitHub fetch failed for ${repo}, falling back to direct API:`, error.message);
  }

  // Fallback to direct GitHub API if VPS is unreachable (cached for 24 hours)
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      next: { revalidate: 86400 } // 24 hours in seconds
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
