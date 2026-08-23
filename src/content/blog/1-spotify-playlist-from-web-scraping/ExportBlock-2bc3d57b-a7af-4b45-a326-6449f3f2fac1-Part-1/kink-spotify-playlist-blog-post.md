---
title: "Create Spotify playlist from web scraped radio chart"
excerpt: "Web scraping a chart from radio station's website and make it a Spotify playlist with the Spotify API."
pubDate: 2026-08-22
category: "flipthedata"
tags: ["python", "web", "process", "projects"]
unlisted: true
draft: false
thumbnail: ./cover.jpg
thumbnailAlt: "Audio mixing table."
imageCredit:
  caption: "Audio mixing table."
  author: "Sašo Tušar"
  authorUrl: "https://unsplash.com/@sasotusar"
  source: "Unsplash"
  sourceUrl: "https://unsplash.com/photos/shallow-focus-photography-of-audio-mixer-QtgGYlug6Cw"
featured: false
---

## Introduction

My favourite radio station published a chart on their website: the top 500 alt-rock songs from the 90s (2025 edition). The only problem? They never turned it into a Spotify playlist. As someone who'd rather write code than click "Add to playlist" 500 times by hand, I decided to automate the process instead.

Using Python, I built a small pipeline that scrapes the chart from the radio station's website and turns it into a real Spotify playlist.

You can find the original chart here (in Dutch): [KINK 90s Top 500 2025](https://kink.nl/nieuws/kink-90s-top-500-2025).

### Workflow overview

The project came down to two main steps:

1. Scrape the chart from the website of KINK, a Dutch radio station.
2. Turn the scraped data into a Spotify playlist using the Spotify API.

## The Process

### Part 1 — Web scraping

> **Script:** `webscraping.py`
> This script takes a URL, pulls out the HTML elements containing the song and artist data, and stores everything in a Python dictionary. The dictionary is converted into a Pandas DataFrame and saved as an Excel file — the finished chart of the top 500 alt-rock songs and their artists.

To find the right data, I opened the KINK website in my browser and inspected the page with the browser's dev tools.

- Each entry in the chart lives inside a `div` with a long, auto-generated Tailwind CSS class name — not very useful on its own.

  ![Inspecting the HTML code of the radio station's website.](image%201.png)
  *Inspecting the HTML code of the radio station's website.*

- Digging one level deeper, the artist–song combination for each entry sits inside a `span` with the class `line-clamp-1`.

  ![Identifying the HTML block of the artist-song combination.](image%202.png)
  *Identifying the HTML block of the artist–song combination in the website code.*

That block could be extracted directly with Beautiful Soup:

```python
songs = soup.find_all("span", attrs={'class': "line-clamp-1"})
print(songs)
print(len(songs))
```

Which returned:

```
[<span class="line-clamp-1">Oasis<!-- --> - <!-- -->Champagne Supernova</span>,
 <span class="line-clamp-1">Nirvana<!-- --> - <!-- -->Smells Like Teen Spirit</span>,
 <span class="line-clamp-1">Pearl Jam<!-- --> - <!-- -->Black</span>,
 <span class="line-clamp-1">Foo Fighters<!-- --> - <!-- -->Everlong</span>,
 ...
 <span class="line-clamp-1">INXS<!-- --> - <!-- -->Disappear</span>,
 <span class="line-clamp-1">Metallica<!-- --> - <!-- -->Turn The Page</span>,
 <span class="line-clamp-1">Fatboy Slim<!-- --> - <!-- -->Right Here, Right Now</span>,
 <span class="line-clamp-1">Oasis<!-- --> - <!-- -->D'You Know What I Mean?</span>]
500
```

My first attempt used `find_all(attrs={'class': "line-clamp-1"})` without specifying the tag, which also picked up the "now playing" song shown at the bottom of the page. Luckily, that element lives in a `p` tag rather than a `span`, so narrowing the search to `span` tags left me with exactly the 500 chart entries I wanted.

From there, the results went into a DataFrame with three columns: an index, the artist name, and the song title.

My first attempt at building that DataFrame failed with:

```
ValueError: If using all scalar values, you must pass an index
```

This happens when you try to build a DataFrame from scalar values without explicitly providing an index ([source](https://saturncloud.io/blog/resolving-valueerror-if-using-all-scalar-values-you-must-pass-an-index-when-merging-multiple-dataframes/)). Switching to `pd.DataFrame.from_dict()` solved it, since it generates an index automatically. From there, exporting to Excel was a one-liner with `.to_excel()`.

### Part 2 — The Spotify API

> **Scripts:** `make_spotify_playlist_from_excel.py`, `search.py`

With the chart safely in an Excel file, the next step was pushing it into Spotify.

- **Authentication:** After the first OAuth call, Spotify redirects to a Google address containing an authentication code, which I pasted back into my IDE to complete the login flow.

  ![Retrieving the Spotify API token.](image%203.png)
  *Retrieving the Spotify API token.*

- I connected to the Spotify API using the [`Spotipy`](https://spotipy.readthedocs.io/en/2.22.1/#) Python library.

Running `make_spotify_playlist_from_excel.py` for the first time didn't go smoothly — it repeatedly failed because the scraped chart data contained small spelling errors, and the Spotify API's search has no fuzzy matching. To work around this, I wrote a small helper script, `search.py`, to look up individual songs on Spotify and confirm their correct titles.

A few of the discrepancies I found:

| Scraped text | Correct Spotify title |
|---|---|
| Green Day — "Good Riddance (Time of *Our* Lives)" | "Good Riddance (Time of *Your* Life)" |
| KLF — "Last Train To Transcentral" | "Last Train To Trancentral" |
| Iggy Pop & Kate Pierson — "Candy" | Iggy Pop — "Candy" |
| Baz Luhrmann — "Everybody's Free (To Wear Sunscreen)" | 90s Classics — "Everybody's Free (To Wear Sunscreen)" |

After correcting these entries in the Excel file and re-running the script, it worked:

![Resulting code response from the Spotify API.](image%204.png)
*The Spotify API confirming the playlist was created successfully.*

![The resulting Spotify playlist.](image%205.png)
*The finished Spotify playlist — 500 alt-rock classics from the 90s, ready to play.*

## Resources

- [KINK 90s Top 500 2025 chart](https://kink.nl/nieuws/kink-90s-top-500-2025)
- [Beautiful Soup documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api)
- [Reference tutorial (YouTube)](https://www.youtube.com/watch?v=WAmEZBEeNmg)

Python libraries used:

```python
import requests
from bs4 import BeautifulSoup

import os
import pandas as pd
from dotenv import load_dotenv

import spotipy
from spotipy.oauth2 import SpotifyOAuth
```

## Things I learned

**Web scraping with Beautiful Soup**
Using `BeautifulSoup4` on a real, third-party website (rather than a tutorial sandbox) taught me a lot about narrowing down selectors — tag *and* class together, not just class alone. I leaned on a few resources along the way:
- Codecademy's lesson on web scraping with Beautiful Soup
- The [Beautiful Soup documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)

**A Pandas refresher**
- Building a DataFrame from a dictionary with `.from_dict()` avoids the "all scalar values" index error ([source](https://saturncloud.io/blog/resolving-valueerror-if-using-all-scalar-values-you-must-pass-an-index-when-merging-multiple-dataframes/)).
- For iterating over rows, `df['column'].to_list()` is noticeably faster than `.iterrows()` — see this [comparison on Medium](https://medium.com/data-science/efficiently-iterating-over-rows-in-a-pandas-dataframe-7dd5f9992c01).

**Environment variables for API calls**
Storing API credentials in environment variables rather than hardcoding them — a good refresher via [Codecademy's article on Python environment variables](https://www.codecademy.com/article/python-environment-variables).

**The Spotify API via Spotipy**
Some of the core building blocks I used from [`Spotipy`](https://spotipy.readthedocs.io/en/2.22.1/#):

```python
sp = spotipy.Spotify(auth_manager=SpotifyOAuth())
# scope = 'playlist-modify-private'

user_id = sp.current_user()["id"]
new_playlist = sp.user_playlist_create(user=user_id, name="[...]")

track_results = sp.search(q=f"track:{song} artist:{artist}", type='track')
sp.playlist_add_items(new_playlist['id'], [track_results['tracks']['items'][0]['uri']])
```

Also useful: [a walkthrough video on the Spotify API](https://www.youtube.com/watch?v=WAmEZBEeNmg).
