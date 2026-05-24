# Data sources

This folder holds the redistributable data the skills draw on. Everything here is either original to this project or permissively licensed.

## analyzed-videos.json

Original work. These are representative teardowns of short form video patterns that perform, authored in ABG CMO's own framework language. They are not scraped TikTok content and contain no real user data. Safe to redistribute. Grow this file freely.

## trending-hashtags.csv

Real TikTok trending hashtag rankings for 2022 through 2025 (1,830 rows: tag, year, rank, posts). This is aggregate ranking data, not individual user content.

Source: ronantakizawa/tiktok-trending-hashtags on Hugging Face.
License: MIT.

## What is deliberately not here

Scraped TikTok video corpora (real captions, transcripts, and engagement) are widely available but are almost always non redistributable and often violate platform terms. We do not vendor any of those. If you want richer real examples, fetch them locally at runtime under each source's own terms rather than committing them here.
