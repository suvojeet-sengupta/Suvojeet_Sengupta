export interface GithubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

/**
 * Fetches repository data from GitHub API
 */
export async function fetchGithubRepo(owner: string, repo: string): Promise<GithubRepo | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repo: ${repo}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching GitHub data for ${repo}:`, error);
    return null;
  }
}
