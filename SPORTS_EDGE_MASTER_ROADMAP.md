# Sports Edge Master Roadmap

## Purpose
Sports Edge is no longer a single MLB betting page. It is becoming a multi-sport betting intelligence platform. The goal is to give users a clean daily card, clear reasoning, accurate trend evidence, and organized performance history without overwhelming them.

---

## 1. Current Product Foundation

### Active Sports
- MLB: active and primary product.
- College Football: prop database started.
- NFL: planned.
- NBA: planned.
- NHL: planned.

### Current Core Sections
- Sport Home Screen
- MLB Today's Picks
- MLB Bet Details
- MLB Series Board
- MLB Research Journal
- MLB Performance Dashboard
- MLB Trend Database
- College Football Prop Database
- Model Center

### Current Product Rule
If a feature is working and the user does not ask to change it, do not touch it.

---

## 2. Product Architecture

### Global App Layer
This is the shared platform layer.

- Home page
- Sport cards
- Navigation
- Authentication later
- Shared styles
- Shared data utilities
- Shared grading rules
- Shared performance calculations

### Sport-Specific Layers
Each sport gets its own identity and data model.

#### MLB
Theme: navy, silver, baseball texture, sharp betting-board style.

Sections:
- Today's Card
- F5 / ML / Over / Under columns
- Series Board
- Research Journal
- Trend Database
- Performance Lab
- Bet Details

Bet Details order:
1. Game Snapshot
2. Model Summary
3. Supporting Evidence
4. Starting Pitcher / K Prop History
5. Research Notes

#### College Football
Theme: Saturday energy, darker stadium background, school-color accent system.

Sections:
- Today's Games
- Team Search
- Player Prop Database
- Player Dropdowns by Team
- Current Line Slot
- Historical Over/Under Hit Lines
- Transfer/New Team Flag
- Research Notes

User flow:
1. Choose College Football.
2. Search or select a team.
3. See that team's game.
4. Expand player prop dropdowns.
5. See position, current line, previous hit/miss lines, and tracked hit rate.

#### NFL
Theme: dark green, gold accents, broadcast-style cards.

Future sections:
- Weekly Card
- Power Ratings
- Situational Trends
- Weather
- Injuries
- Public Betting
- Performance

#### NBA
Theme: black, orange, fast/player-centric.

Future sections:
- Today's Card
- Rest Advantage
- Back-to-Back Spots
- Injuries
- Pace
- Player Props
- Performance

#### NHL
Theme: ice blue, white, clean/minimal.

Future sections:
- Today's Card
- Goalie Matchups
- Travel
- Back-to-Back
- Puck Line
- Shots / Saves Props
- Performance

---

## 3. Data Architecture

### Main Data Folders
Create one clean data folder per sport.

```text
data/
  mlb/
    picks.json
    trends.json
    series.json
    research.json
    propHistory.json
    performance.json
  college-football/
    playerProps.json
    teams.json
    research.json
  nfl/
    trends.json
    picks.json
  nba/
  nhl/
```

### Component Folders
```text
src/
  components/
    shared/
    mlb/
    college-football/
    nfl/
    nba/
    nhl/
  pages/
  utils/
  styles/
```

### One Source of Truth Rule
Records and performance must come from one table only:

```text
historicalPicks
```

No section should independently calculate a conflicting total record.

---

## 4. GitHub Migration Plan

### Step 1: Create GitHub Account
Go to GitHub and create or log into the company account.

Recommended repository name:

```text
sports-edge-app
```

Make it private at first.

### Step 2: Create Local Project Folder
On your computer:

```bash
mkdir sports-edge-app
cd sports-edge-app
```

### Step 3: Download Latest Stable ZIP
Use the latest stable build from ChatGPT. Current working base should be the newest version you approve.

Unzip it into:

```text
sports-edge-app/
```

### Step 4: Initialize Git
```bash
git init
git add .
git commit -m "Initial Sports Edge stable app"
```

### Step 5: Connect GitHub Repository
After creating the GitHub repo, GitHub will show a command like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sports-edge-app.git
git branch -M main
git push -u origin main
```

### Step 6: Protect Main Branch
In GitHub:

1. Open repository.
2. Go to Settings.
3. Go to Branches.
4. Add branch protection rule for `main`.
5. Require pull request before merging.

This prevents accidental breaking changes.

---

## 5. Vercel Deployment Plan

### Step 1: Create Vercel Account
Go to Vercel and sign in with GitHub.

### Step 2: Import GitHub Repo
Click:

```text
Add New Project
```

Choose:

```text
sports-edge-app
```

### Step 3: Deploy
For the current static version:

- Framework preset: Other / Static
- Build command: leave blank unless using a framework
- Output directory: root or dist depending on project structure

### Step 4: Test Live Link
Vercel gives a link like:

```text
sports-edge-app.vercel.app
```

This becomes your shareable test link.

### Step 5: Add Domain Later
Buy the domain from GoDaddy, Namecheap, or Cloudflare.

Point it to Vercel.

---

## 6. Development Workflow Going Forward

### Never Edit Main Directly
Every change becomes a branch.

Example:

```bash
git checkout -b feature/college-football-props
```

After changes:

```bash
git add .
git commit -m "Add college football prop database"
git push origin feature/college-football-props
```

Then open a Pull Request in GitHub.

### Feature Update Rule
Every update must say:

- What section is being changed
- What section must not be touched
- What data is being added
- What file/component should be edited

Example:

```text
Change only CollegeFootballProps.jsx and data/college-football/playerProps.json.
Do not edit MLB Today’s Picks, Series Board, or Performance Lab.
```

---

## 7. Cleanup Plan

### Cleanup Day 1: Freeze Stable Version
Pick one approved version as the baseline.

Recommended label:

```text
stable-v1
```

Git command:

```bash
git tag stable-v1
git push origin stable-v1
```

### Cleanup Day 2: Split Files
Move from one giant HTML file into organized files.

Target structure:

```text
index.html
src/
  app.js
  styles.css
  data.js
```

Then later:

```text
src/components/mlb/TodaysPicks.js
src/components/mlb/SeriesBoard.js
src/components/mlb/PerformanceLab.js
src/components/mlb/ResearchJournal.js
src/components/college-football/CollegeFootballProps.js
```

### Cleanup Day 3: Extract Data
Move hardcoded data out of UI code.

Example:

```text
data/mlb/picks.json
data/mlb/series.json
data/mlb/research.json
data/college-football/playerProps.json
```

### Cleanup Day 4: Add Tests / Safety Checks
Add basic checks:

- App loads
- Today's Picks renders
- Bet Details opens
- Series Board renders
- Performance Dashboard renders
- College Football team search works

### Cleanup Day 5: Connect Vercel
Once GitHub is stable, deploy to Vercel.

---

## 8. Daily Operating Workflow

### Morning
1. Add today’s slate.
2. Add picks.
3. Add matchup subtitles.
4. Add units if explicitly provided.
5. Add research notes only if useful.

### Afternoon
1. Verify all cards render.
2. Check Bet Details.
3. Check Performance Dashboard.
4. Check Series Board.

### Night / Next Morning
1. Grade completed picks.
2. Update performance.
3. Add lessons to Research Journal.
4. Leave pending only for games not finished.

---

## 9. Grading Rules

### Moneyline
Team wins final game = Win.
Team loses final game = Loss.

### Totals
Over wins if final total runs/points is greater than line.
Under wins if final total runs/points is lower than line.
Exact number = Push.

### F5
Use score after 5 innings only.

- F5 -0.5 wins if selected team leads after 5.
- F5 +0.5 wins if selected team is tied or leading after 5.

### Series
Series bet wins if selected team wins the series.
Series bet loses if selected team loses the series.
Pending only until series is completed.

### Props
Use official player box score.

- Over wins if player stat is above line.
- Under wins if player stat is below line.
- Exact line = Push.

---

## 10. Do Not Change Unless Requested

These are stable product rules.

- Do not remove matchup subtitles.
- Do not merge sports pages into one cluttered page.
- Do not show duplicate performance dashboards.
- Do not show spread/parlay in performance unless requested.
- Do not assign fake units unless current app rule is changed.
- Do not show matched trend evidence unless the exact context applies.
- Do not overload main pick cards with long writeups.
- Put long analysis in Bet Details or Research Journal.
- Keep the user flow simple.

---

## 11. Product Priorities

### Priority 1: Stability
No blank screens. No broken buttons. No lost data.

### Priority 2: Clarity
Users should instantly understand:

- What the pick is
- Who is playing
- Why it matters
- Whether it won or lost

### Priority 3: Trust
Every grade should be traceable.
Every trend should match the correct context.

### Priority 4: Expansion
Add sports one at a time without breaking MLB.

---

## 12. Immediate Next Actions

### Action 1
Choose the latest approved ZIP as the official stable base.

### Action 2
Create GitHub repo.

### Action 3
Upload stable base.

### Action 4
Deploy to Vercel.

### Action 5
Create first cleanup branch:

```text
feature/project-cleanup-phase-1
```

### Action 6
Split the app into folders/files.

### Action 7
Move data into JSON files.

### Action 8
Create a written update rule for every future change:

```text
Requested change:
Files allowed to change:
Files not allowed to change:
Expected result:
Test checklist:
```

---

## 13. Prototype Sprint Plan

### Sprint 1: GitHub + Vercel
Goal: Shareable live link with stable app.

### Sprint 2: File Cleanup
Goal: Separate UI, data, and logic.

### Sprint 3: Data Cleanup
Goal: Move picks, trends, series, research, and props into structured JSON.

### Sprint 4: MLB Reliability
Goal: Lock MLB Today’s Picks, Series Board, Performance, and Bet Details.

### Sprint 5: College Football Expansion
Goal: Improve team/player prop database and add current line workflow.

### Sprint 6: Auto-Grading Infrastructure
Goal: Plan API integration and database grading system.

---

## Final Rule
Build Sports Edge like a professional product, not a chain of ZIP files.

Every update should be smaller, safer, and easier to test than the last.
