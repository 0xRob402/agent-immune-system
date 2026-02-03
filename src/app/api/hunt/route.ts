import { NextResponse } from 'next/server';
import { searchBountyIssues, parseRepoUrl, extractBountyAmount } from '@/lib/github';
import { createBounty, getBounties, logActivity } from '@/lib/pressbase';

export const dynamic = 'force-dynamic';

// POST /api/hunt - Search for new bounties and add them to the database
export async function POST() {
  try {
    await logActivity({ action: 'hunt_started', success: true });

    // Search GitHub for bounty-labeled issues
    const issues = await searchBountyIssues({
      labels: ['bounty', 'bug-bounty', 'help wanted', 'good first issue'],
      limit: 50,
    });

    // Get existing bounties to avoid duplicates
    const existing = await getBounties({ limit: 1000 });
    const existingUrls = new Set((existing.data || []).map(b => b.issue_url));

    let added = 0;
    let skipped = 0;
    const newBounties = [];

    for (const issue of issues) {
      // Skip if already tracked
      if (existingUrls.has(issue.html_url)) {
        skipped++;
        continue;
      }

      // Parse repo info from URL
      const repoInfo = parseRepoUrl(issue.repository_url);
      if (!repoInfo) continue;

      // Try to extract bounty amount from title or body
      const bountyInfo = extractBountyAmount(issue.title) || extractBountyAmount(issue.body || '');

      // Determine difficulty from labels
      const labels = issue.labels.map(l => l.name.toLowerCase());
      let difficulty = 'unknown';
      if (labels.some(l => l.includes('easy') || l.includes('beginner') || l.includes('good first'))) {
        difficulty = 'easy';
      } else if (labels.some(l => l.includes('medium') || l.includes('intermediate'))) {
        difficulty = 'medium';
      } else if (labels.some(l => l.includes('hard') || l.includes('complex') || l.includes('advanced'))) {
        difficulty = 'hard';
      }

      // Create the bounty
      const result = await createBounty({
        repo_owner: repoInfo.owner,
        repo_name: repoInfo.repo,
        issue_number: issue.number,
        issue_title: issue.title,
        issue_url: issue.html_url,
        bounty_amount: bountyInfo?.amount,
        bounty_currency: bountyInfo?.currency,
        status: 'found',
        labels: issue.labels.map(l => l.name),
        difficulty,
      });

      if (result.ok) {
        added++;
        newBounties.push(result.data);
      }
    }

    await logActivity({
      action: 'hunt_completed',
      details: { found: issues.length, added, skipped },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: `Found ${issues.length} issues, added ${added} new bounties, skipped ${skipped} duplicates`,
      newBounties,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    await logActivity({
      action: 'hunt_failed',
      details: { error: message },
      success: false,
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
