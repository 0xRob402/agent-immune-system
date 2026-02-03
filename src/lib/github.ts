// GitHub API client for Bounty Hunter

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  html_url: string;
  labels: Array<{ name: string; color: string }>;
  state: string;
  repository_url: string;
  created_at: string;
  updated_at: string;
}

interface GitHubSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}

async function githubApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
      'User-Agent': '0xRob-Bounty-Hunter',
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`GitHub API error: ${error.message}`);
  }
  
  return res.json();
}

// Search for bounty-labeled issues
export async function searchBountyIssues(options?: {
  labels?: string[];
  language?: string;
  limit?: number;
}): Promise<GitHubIssue[]> {
  const labels = options?.labels || ['bounty', 'bug-bounty', 'help wanted', 'good first issue', 'hacktoberfest'];
  const limit = options?.limit || 30;
  
  // Build search query
  let query = 'is:issue is:open';
  query += ` label:"${labels.join('" OR label:"')}"`;
  if (options?.language) {
    query += ` language:${options.language}`;
  }
  
  const result = await githubApi<GitHubSearchResult>(
    `/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=${limit}`
  );
  
  return result.items;
}

// Get issue details
export async function getIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue> {
  return githubApi<GitHubIssue>(`/repos/${owner}/${repo}/issues/${issueNumber}`);
}

// Get repo info
export async function getRepo(owner: string, repo: string) {
  return githubApi<{
    name: string;
    full_name: string;
    description: string;
    language: string;
    stargazers_count: number;
    topics: string[];
  }>(`/repos/${owner}/${repo}`);
}

// Fork a repo
export async function forkRepo(owner: string, repo: string) {
  return githubApi<{ full_name: string; html_url: string }>(
    `/repos/${owner}/${repo}/forks`,
    { method: 'POST' }
  );
}

// Create a branch (via refs)
export async function createBranch(owner: string, repo: string, branchName: string, fromSha: string) {
  return githubApi<{ ref: string }>(
    `/repos/${owner}/${repo}/git/refs`,
    {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: fromSha,
      }),
    }
  );
}

// Get default branch SHA
export async function getDefaultBranchSha(owner: string, repo: string): Promise<string> {
  const repoData = await getRepo(owner, repo);
  const branch = await githubApi<{ commit: { sha: string } }>(
    `/repos/${owner}/${repo}/branches/main`
  ).catch(() => 
    githubApi<{ commit: { sha: string } }>(`/repos/${owner}/${repo}/branches/master`)
  );
  return branch.commit.sha;
}

// Create or update file
export async function createOrUpdateFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string,
  existingSha?: string
) {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
  };
  if (existingSha) body.sha = existingSha;
  
  return githubApi<{ commit: { sha: string } }>(
    `/repos/${owner}/${repo}/contents/${path}`,
    { method: 'PUT', body: JSON.stringify(body) }
  );
}

// Create pull request
export async function createPullRequest(
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base: string = 'main'
) {
  return githubApi<{
    number: number;
    html_url: string;
    state: string;
  }>(`/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, body, head, base }),
  });
}

// Check PR status
export async function getPullRequest(owner: string, repo: string, prNumber: number) {
  return githubApi<{
    number: number;
    state: string;
    merged: boolean;
    html_url: string;
  }>(`/repos/${owner}/${repo}/pulls/${prNumber}`);
}

// Parse repo owner and name from URL
export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

// Extract bounty amount from issue text
export function extractBountyAmount(text: string): { amount: number; currency: string } | null {
  // Match patterns like "$100", "100 USDC", "$50 bounty", etc.
  const patterns = [
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|USDC|bounty)?/i,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(USD|USDC)/i,
    /bounty[:\s]+\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const currency = match[2]?.toUpperCase() || 'USD';
      return { amount, currency };
    }
  }
  
  return null;
}
