#!/usr/bin/env python3
"""
ZarishSphere Universal Serialization Standard (ZUSS) Validator
================================================================
Automated checks for all ZUSS rules (Z01-Z25).

Usage:
  ./scripts/validate-zuss.py                        # Check all docs/
  ./scripts/validate-zuss.py docs/foo.md            # Check specific file
  ./scripts/validate-zuss.py --ci                   # Exit code 1 on any failure
"""

import os
import re
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime, timezone, timedelta

REPO_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = REPO_DIR / "docs"

PASS = 0
FAIL = 1
WARN = 2

results: list[dict] = []

EXEMPT_FILENAMES = {
    "README.md", "LICENSE", "LICENSE.md", "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md", "SECURITY.md", "CHANGELOG.md",
    "AGENTS.md", "CLAUDE.md", "TODO.md", "llms.txt",
    "mkdocs.yml", "index.md", "SKILL.md",
}

BANNED_WORDS = {"genuinely", "honestly", "straightforward"}

DISCOURAGED_WORDS = {
    "seamless", "seamlessly", "cutting-edge", "powerful", "robust",
    "revolutionary", "game-changing", "best-in-class", "world-class",
    "state-of-the-art",
}

BRAND_PATTERNS = [
    # AI providers
    r'\b(GPT-4|GPT-4o|GPT-4\.1|o1|o3|Claude|Gemini|DeepSeek|Llama|Mistral|DALL-E|Stable Diffusion)\b',
    # Frameworks
    r'\b(React|Next\.js|Vue|Angular|Svelte|Django|Flask|FastAPI|Spring Boot|Rails|Laravel|Express\.js|Nuxt|Astro|Solid)\b',
    # Languages
    r'\b(Python|TypeScript|JavaScript|Rust|Go|Java|C#|Ruby|PHP|Swift|Kotlin)\s*[0-9]+\.[0-9]+\b',
    # Databases
    r'\b(PostgreSQL|MySQL|MongoDB|SQLite|Redis|Elasticsearch|Cassandra|DynamoDB|Firebase|Supabase)\b',
    # Cloud
    r'\b(AWS|Azure|GCP|Google Cloud|Cloudflare|Vercel|Netlify|Heroku|DigitalOcean|Railway)\b',
    # Tools
    r'\b(Docker|Kubernetes|Terraform|Ansible|Jenkins|GitHub Actions|GitLab CI|CircleCI)\b',
    # Version patterns
    r'\bv?[0-9]+\.[0-9]+\.[0-9]+\b',
    r'\bv?[0-9]+\.[0-9]+\b(?!\s*(?:x|X))',
    # URLs to known tech
    r'https?://(?:www\.)?(?:npmjs\.com|pypi\.org|crates\.io|github\.com|docker\.com)/',
]

CITATION_RE = re.compile(
    r'→\s+\*\*(.+?)\*\*\s*(?:—|–|-)\s*https?://\S+'
    r'|→\s+\[Category [A-J]:\s*.+?\]'
    r'|→\s+\*\*.*?\*\*\s*—',
    re.MULTILINE,
)

NEWS_CITATION_DATE_RE = re.compile(
    r'→\s+\*\*.*?\*\*\s*—\s*https?://\S+\s*—\s*(?:.*?\b(\d{4}-\d{2}-\d{2}|\d{1,2}\s+\w+\s+\d{4})\b)',
    re.MULTILINE,
)

SOURCE_CATEGORY_RE = re.compile(
    r'\[Category ([A-J]):\s*([^\]]+)\]',
)

EOL_PATTERNS = [
    r'\bversion\s+(?:is|of)\s+(?:currently\s+)?(?:at\s+)?v?(\d+\.\d+(?:\.\d+)?)\b',
]


def log(rule: str, status: int, filepath: str, message: str):
    results.append({"rule": rule, "status": status, "file": filepath, "message": message})
    label = {PASS: "PASS", FAIL: "FAIL", WARN: "WARN"}
    print(f"  [{label[status]}] {rule}: {message}")


# ── File scan ──────────────────────────────────────────────────────────────

def get_markdown_files(paths: list[str] | None) -> list[Path]:
    if paths:
        return [Path(p).resolve() for p in paths if Path(p).suffix == ".md"]
    files = []
    for mdfile in DOCS_DIR.rglob("*.md"):
        skip_parts = {"_data", "_progress", "node_modules", "dist", ".git"}
        if not any(part in skip_parts for part in mdfile.parts):
            files.append(mdfile)
    return sorted(files)


def read_file(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except Exception as e:
        log("FILE", FAIL, str(path), f"Cannot read: {e}")
        return None


# ── Z01: Filename pattern ──────────────────────────────────────────────────

def check_z01(filepath: Path):
    name = filepath.name
    if name in EXEMPT_FILENAMES:
        return
    pattern = r'^[0-9]{3}-[a-z0-9-]+\.[a-z]+$'
    if not re.match(pattern, name):
        log("Z01", FAIL, str(filepath),
            f"Filename '{name}' does not match pattern nnn-descriptive-name.ext")


# ── Z02: No doubled extension ──────────────────────────────────────────────

def check_z02(filepath: Path):
    name = filepath.name
    if re.search(r'\.(md\.md|yml\.yml|yaml\.yaml|json\.json)$', name):
        log("Z02", FAIL, str(filepath), f"Doubled extension in '{name}'")


# ── Z03: No uppercase in filename ──────────────────────────────────────────

def check_z03(filepath: Path):
    name = filepath.name
    if name in EXEMPT_FILENAMES:
        return
    if re.search(r'[A-Z]', name):
        log("Z03", FAIL, str(filepath), f"Uppercase character in '{name}'")


# ── Z04: No underscore or space in filename ────────────────────────────────

def check_z04(filepath: Path):
    name = filepath.name
    if name in EXEMPT_FILENAMES:
        return
    if '_' in name or ' ' in name:
        log("Z04", FAIL, str(filepath), f"Underscore or space in '{name}'")


# ── Z05: Class A header block ──────────────────────────────────────────────

def check_z05(filepath: Path, content: str):
    if content.startswith("---"):
        return
    has_header = bool(re.search(
        r'##\s+.+?\n###\s+.+?\n\n\*\*Document type:\*\*',
        content, re.DOTALL
    ))
    if not has_header:
        log("Z05", WARN, str(filepath), "Missing Class A header block")


# ── Z06: Class B frontmatter ───────────────────────────────────────────────

def check_z06(filepath: Path, content: str):
    if not content.startswith("---"):
        return
    end = content.find("---", 3)
    if end == -1:
        log("Z06", FAIL, str(filepath), "Unterminated YAML frontmatter")
        return
    fm = content[3:end].strip()
    required = ["title", "domain", "description", "version", "status"]
    missing = [f for f in required if not re.search(rf'^{f}:', fm, re.MULTILINE)]
    if missing:
        log("Z06", FAIL, str(filepath), f"Missing frontmatter fields: {', '.join(missing)}")


# ── Z07: No mixed schemas ──────────────────────────────────────────────────

def check_z07(filepath: Path, content: str):
    if content.startswith("---"):
        rest = content[content.find("---", 3) + 3:].strip()
        if re.search(r'\*\*Document type:\*\*', rest):
            log("Z07", FAIL, str(filepath), "Mixed YAML frontmatter and header block")


# ── Z08: Footer check ──────────────────────────────────────────────────────

def check_z08(filepath: Path, content: str):
    if content.startswith("---"):
        return
    has_footer = (
        "ZarishSphere Foundation" in content
        and "License:" in content
    )
    if not has_footer:
        log("Z08", WARN, str(filepath), "Missing Class A footer")


# ── Z09: Banned words ──────────────────────────────────────────────────────

def check_z09(filepath: Path, content: str):
    for word in BANNED_WORDS:
        if re.search(rf'\b{re.escape(word)}\b', content, re.IGNORECASE):
            log("Z09", FAIL, str(filepath), f"Banned word: '{word}'")


# ── Z10: ID prefix check ───────────────────────────────────────────────────

def check_z10(filepath: Path, content: str):
    known_prefixes = {
        "zs-", "zs-form-", "ADR-", "ZI-", "HL-", "HR-", "ENV-", "GEO-",
        "SKILL-", "DGM-", "PRM-", "POL-",
    }
    found = set(re.findall(r'\b([A-Z]{2,10}-)[A-Z0-9]', content))
    unknown = found - known_prefixes
    for prefix in unknown:
        log("Z10", WARN, str(filepath), f"Unknown ID prefix '{prefix}' — check Section 5 registry")


# ── Z11: Workflow file pattern ─────────────────────────────────────────────

def check_z11(filepath: Path):
    if ".github/workflows" not in str(filepath):
        return
    name = filepath.name
    if not re.match(r'^\d{3}--[a-z0-9-]+--[a-z0-9-]+\.ya?ml$', name):
        log("Z11", FAIL, str(filepath), f"Workflow '{name}' does not match [id]--[trigger]--[process].yml")


# ── Z12: No `latest` tag ───────────────────────────────────────────────────

def check_z12(filepath: Path, content: str):
    if re.search(r':latest\b', content):
        log("Z12", FAIL, str(filepath), "Docker image references ':latest' tag")


# ── Z13: Class B OKF type field ────────────────────────────────────────────

def check_z13(filepath: Path, content: str):
    if not content.startswith("---"):
        return
    okf_types = {"okf-document", "okf-resource", "okf-skill", "okf-prompt", "okf-policy", "okf-diagram"}
    m = re.search(r'^type:\s*["\']?(.+?)["\']?\s*$', content[:content.find("---", 3)], re.MULTILINE)
    if m and m.group(1) not in okf_types:
        log("Z13", WARN, str(filepath), f"OKF type '{m.group(1)}' not in standard list")


# ── Z14: Mermaid diagram caption ───────────────────────────────────────────

def check_z14(filepath: Path, content: str):
    if "```mermaid" not in content:
        return
    diagrams = content.split("```mermaid")
    for i, block in enumerate(diagrams[1:], 1):
        caption_block = block.split("```")[1] if "```" in block else block
        if not re.search(r'\*Figure\s+\d+:', caption_block):
            log("Z14", WARN, str(filepath), f"Mermaid diagram #{i} missing caption (*Figure N: ...)")


# ── Z15: SKILL.md frontmatter ──────────────────────────────────────────────

def check_z15(filepath: Path, content: str):
    if filepath.name != "SKILL.md":
        return
    if not content.startswith("---"):
        log("Z15", FAIL, str(filepath), "SKILL.md missing YAML frontmatter")
        return
    end = content.find("---", 3)
    fm = content[3:end].strip()
    required = {"name", "description", "type: \"okf-skill\""}
    missing = [f for f in required if f not in fm]
    if missing:
        log("Z15", FAIL, str(filepath), f"SKILL.md missing: {', '.join(missing)}")


# ── Z16: Prompt documents ──────────────────────────────────────────────────

def check_z16(filepath: Path, content: str):
    if not content.startswith("---"):
        return
    if not re.search(r'type:\s*["\']?okf-prompt["\']?', content[:500]):
        return
    sections = ["## Role", "## Instructions"]
    missing = [s for s in sections if s not in content]
    if missing:
        log("Z16", WARN, str(filepath), f"Prompt missing sections: {', '.join(missing)}")


# ── Z17: Policy companion .md ──────────────────────────────────────────────

def check_z17(filepath: Path):
    if filepath.suffix in {".rego", ".cedar", ".cel"}:
        md_path = filepath.with_suffix(".md")
        if not md_path.exists():
            log("Z17", FAIL, str(filepath), f"Policy file missing companion .md: {md_path.name}")


# ── Z18: Source citation required for tech references ──────────────────────

def check_z18(filepath: Path, content: str):
    if content.startswith("---"):
        fm_end = content.find("---", 3)
        body = content[fm_end + 3:] if fm_end != -1 else content
    else:
        body = content

    tech_mentions = set()
    for pat in BRAND_PATTERNS:
        matches = re.findall(pat, body, re.IGNORECASE)
        tech_mentions.update(matches)

    if not tech_mentions:
        return

    citations = CITATION_RE.findall(body)
    if not citations:
        # Skip if body has no tech mentions after filtering common false positives
        filtered = [t for t in tech_mentions if len(t) > 2]
        if filtered:
            log("Z18", FAIL, str(filepath),
                f"References external technology ({', '.join(sorted(filtered)[:5])}) "
                f"but no source citation from Information Source Registry found")


# ── Z19: Citation format check ─────────────────────────────────────────────

def check_z19(filepath: Path, content: str):
    body = content
    if content.startswith("---"):
        fm_end = content.find("---", 3)
        body = content[fm_end + 3:] if fm_end != -1 else content

    citations = CITATION_RE.findall(body)
    for cit in citations:
        if isinstance(cit, str) and cit.strip():
            if not re.search(r'https?://', cit) and not re.search(r'\[Category [A-J]\]', str(cit)):
                log("Z19", FAIL, str(filepath),
                    f"Citation '{cit[:80]}' does not match format → **Source** — URL "
                    f"or → [Category X: name]")


# ── Z20: EOL version check ─────────────────────────────────────────────────

def check_z20(filepath: Path, content: str):
    known_eol = {
        "node": {"12", "14", "16", "17", "19", "21", "23"},
        "python": {"2.7", "3.5", "3.6", "3.7"},
        "react": {"16"},
        "angular": {"2", "4", "5", "6", "7", "8", "9", "10", "11", "12"},
    }
    body = content
    if content.startswith("---"):
        fm_end = content.find("---", 3)
        body = content[fm_end + 3:] if fm_end != -1 else content

    for tech, eol_versions in known_eol.items():
        for ver in eol_versions:
            pattern = rf'\b{re.escape(tech)}\s*[vV]?\s*{re.escape(ver)}\b'
            if re.search(pattern, body, re.IGNORECASE):
                if not re.search(r'migration|deprecated|EOL|end.of.life|sunset', body, re.IGNORECASE):
                    log("Z20", FAIL, str(filepath),
                        f"References {tech} v{ver} (EOL) without migration note")


# ── Z21: Package version freshness ─────────────────────────────────────────

def check_z21(filepath: Path, content: str):
    """
    Checks for package references (npm/PyPI/crates.io) with
    version numbers and flags if they appear stale.
    Uses static known-latest map (offline-safeguard, manual update).
    """
    known_latest = {
        "react": "19.2.0", "react-dom": "19.2.0", "typescript": "6.0.0",
        "tailwindcss": "4.3.0", "vitest": "4.1.0", "vite": "6.0.0",
        "next": "15.2.0", "vue": "3.5.0", "svelte": "5.0.0",
        "playwright": "1.62.0", "express": "5.1.0", "django": "5.1.0",
        "python": "3.13.0", "node": "26.0.0", "go": "1.24.0",
        "rust": "1.85.0", "kubernetes": "1.32.0",
    }
    body = content
    if content.startswith("---"):
        fm_end = content.find("---", 3)
        body = content[fm_end + 3:] if fm_end != -1 else content

    for pkg, latest in known_latest.items():
        pattern = rf'\b{re.escape(pkg)}\s*v?(\d+\.\d+(?:\.\d+)?)\b'
        for m in re.finditer(pattern, body, re.IGNORECASE):
            ver_str = m.group(1)
            try:
                parts_ref = [int(x) for x in ver_str.split(".")]
                parts_latest = [int(x) for x in latest.split(".")]
                if len(parts_ref) < 2 or len(parts_latest) < 2:
                    continue
                minor_behind = parts_latest[0] - parts_ref[0] if parts_latest[0] > parts_ref[0] else 0
                if parts_latest[0] == parts_ref[0] and len(parts_latest) > 1 and len(parts_ref) > 1:
                    minor_behind = parts_latest[1] - parts_ref[1]

                if minor_behind >= 2:
                    log("Z21", FAIL, str(filepath),
                        f"References {pkg}@{ver_str} but latest is {latest} "
                        f"({minor_behind} minor versions behind)")
            except ValueError:
                pass


# ── Z22: Competitive tech comparison source ────────────────────────────────

def check_z22(filepath: Path, content: str):
    body = content
    if content.startswith("---"):
        fm_end = content.find("---", 3)
        body = content[fm_end + 3:] if fm_end != -1 else content

    comparison_patterns = [
        r'\b(vs\.?|versus|compared to|alternative to|vs\.|instead of)\s+\w+',
    ]
    has_comparison = any(re.search(pat, body, re.IGNORECASE) for pat in comparison_patterns)
    if has_comparison:
        has_e_source = bool(re.search(r'stackshare|libhunt|npmtrends|pypistats|alternativeto', body, re.IGNORECASE))
        if not has_e_source:
            log("Z22", WARN, str(filepath),
                "Competes/compares technologies but no Category E or J source cited")


# ── Z23: Security advisory source count ────────────────────────────────────

def check_z23(filepath: Path, content: str):
    body = content
    if content.startswith("---"):
        fm_end = content.find("---", 3)
        body = content[fm_end + 3:] if fm_end != -1 else content

    is_security = bool(re.search(
        r'security advisory|CVE-|GHSA-|vulnerability\s+(?:report|database|disclosure)|security\s+vulnerabilit',
        body, re.IGNORECASE
    ))
    if is_security:
        cat_f_sources = re.findall(
            r'(nvd\.nist\.gov|cve\.org|github\.com/advisories|opencve\.io|vulners\.com|'
            r'cisa\.gov|openssf\.org|snyk\.io|socket\.dev|osv\.dev|mend\.io)',
            body, re.IGNORECASE
        )
        unique_sources = set(s.lower() for s in cat_f_sources)
        if len(unique_sources) < 2:
            log("Z23", WARN, str(filepath),
                f"Security advisory cites {len(unique_sources)} Category F source(s), needs ≥2")


# ── Z24: News citation date ────────────────────────────────────────────────

def check_z24(filepath: Path, content: str):
    body = content
    if content.startswith("---"):
        fm_end = content.find("---", 3)
        body = content[fm_end + 3:] if fm_end != -1 else content

    news_domains = re.findall(
        r'(news\.ycombinator\.com|lobste\.rs|dev\.to|reddit\.com|'
        r'thenewstack\.io|techmeme\.com|infoq\.com|github\.blog)',
        body, re.IGNORECASE
    )
    if news_domains:
        has_dates = NEWS_CITATION_DATE_RE.search(body)
        if not has_dates:
            log("Z24", WARN, str(filepath),
                "Cites news sources (Category G) but citations lack date")


# ── Z25: Freshness check ───────────────────────────────────────────────────

def check_z25(filepath: Path):
    now = datetime.now(timezone.utc)
    mtime = datetime.fromtimestamp(filepath.stat().st_mtime, tz=timezone.utc)
    age = now - mtime
    if age > timedelta(days=90):
        body = filepath.read_text(encoding="utf-8", errors="ignore")
        has_tech = any(re.search(pat, body, re.IGNORECASE) for pat in BRAND_PATTERNS)
        if has_tech:
            log("Z25", WARN, str(filepath),
                f"Not updated in {age.days} days (>90) and references external technology "
                f"— freshness review recommended")


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    import argparse
    parser = argparse.ArgumentParser(description="ZUSS Validation (Z01-Z25)")
    parser.add_argument("files", nargs="*", help="Specific files to check")
    parser.add_argument("--ci", action="store_true", help="Exit with code 1 on any failure")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    args = parser.parse_args()

    files = get_markdown_files(args.files if args.files else None)

    print(f"ZUSS Validator — checking {len(files)} file(s)")
    print("=" * 50)

    for fp in files:
        rel = fp.relative_to(REPO_DIR)
        print(f"\n{rel}")
        content = read_file(fp)
        if content is None:
            continue
        check_z01(fp)
        check_z02(fp)
        check_z03(fp)
        check_z04(fp)
        check_z05(fp, content)
        check_z06(fp, content)
        check_z07(fp, content)
        check_z08(fp, content)
        check_z09(fp, content)
        check_z10(fp, content)
        check_z11(fp)
        check_z12(fp, content)
        check_z13(fp, content)
        check_z14(fp, content)
        check_z15(fp, content)
        check_z16(fp, content)
        check_z17(fp)
        check_z18(fp, content)
        check_z19(fp, content)
        check_z20(fp, content)
        check_z21(fp, content)
        check_z22(fp, content)
        check_z23(fp, content)
        check_z24(fp, content)
        check_z25(fp)

    # Summary
    fails = [r for r in results if r["status"] == FAIL]
    warns = [r for r in results if r["status"] == WARN]
    passes = [r for r in results if r["status"] == PASS]

    print("\n" + "=" * 50)
    print(f"Summary: {len(passes)} passed, {len(fails)} failed, {len(warns)} warnings")

    if args.json:
        print("\n" + json.dumps(results, indent=2))

    if fails and args.ci:
        sys.exit(1)
    sys.exit(0 if not fails else 1)


if __name__ == "__main__":
    main()
