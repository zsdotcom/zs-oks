export type DiffType = 'unchanged' | 'added' | 'removed';

export interface DiffLine {
  type: DiffType;
  text: string;
  oldLine?: number;
  newLine?: number;
}

function lcsLength(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

function backtrack(a: string[], b: string[], dp: number[][], i: number, j: number, result: DiffLine[], oldLine: { v: number }, newLine: { v: number }): void {
  if (i === 0 && j === 0) return;
  if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
    backtrack(a, b, dp, i - 1, j - 1, result, oldLine, newLine);
    result.push({ type: 'unchanged', text: a[i - 1], oldLine: oldLine.v++, newLine: newLine.v++ });
  } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
    backtrack(a, b, dp, i, j - 1, result, oldLine, newLine);
    result.push({ type: 'added', text: b[j - 1], newLine: newLine.v++ });
  } else if (i > 0) {
    backtrack(a, b, dp, i - 1, j, result, oldLine, newLine);
    result.push({ type: 'removed', text: a[i - 1], oldLine: oldLine.v++ });
  }
}

export function computeDiff(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split('\n');
  const b = newText.split('\n');
  const dp = lcsLength(a, b);
  const result: DiffLine[] = [];
  backtrack(a, b, dp, a.length, b.length, result, { v: 1 }, { v: 1 });
  return result;
}
