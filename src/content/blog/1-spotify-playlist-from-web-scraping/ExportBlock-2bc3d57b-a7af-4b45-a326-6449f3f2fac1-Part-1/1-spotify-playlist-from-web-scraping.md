# Web scraping chart from radio station’s website and make Spotify playlist with Spotify API

Owner: Philip
Tags: Projects
Active Status: Not started
Created time: September 20, 2025 10:37 AM

## Introduction

My favourite radio station had a chart on their website of the top 500 alt-rock songs from the 90s (2025 edition). However, they didn’t made it into a Spotify playlist and, being a coding interested guy, I didn’t want to manually put it into a Spotify playlist myself. So, with my Python knowledge I set to work on automating some parts of the process of creating the Spotify playlist. I started with web scraping the chart from the website of the radio station with the Python library [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/). 

Here is a link to the chart (Dutch): [https://kink.nl/nieuws/kink-90s-top-500-2025](https://kink.nl/nieuws/kink-90s-top-500-2025).

### **Workflow Steps**

- Web scraping the chart from the website of my favourite radio station in the Netherlands (KINK)
- Make a Spotify playlist of the scraped playlist

## The Process

### 1st part - Web scraping

<aside>
<img src="https://app.notion.com/icons/report_blue.svg" alt="https://app.notion.com/icons/report_blue.svg" width="40px" />

Used a separate script for the web scraping part: `webscraping.py`. The script needs a weblink and returns the specific html data that, among others, contains the song and artist data and stores it in a Python dictionary. The dictionary is converted to a Pandas DataFrame (`.from_dict` automatically includes an Index, see link) and saved to Excel. The resulting Excel is the chart/hit list of the top 500 alt-rock songs and its artist(s).

</aside>

- Web scraping with the Python module `BeautifulSoup4`
- Inspect the website of radio station ‘KINK’ with the inspect tool of the web browser
- Each playlist entry on the website is in a `div` block with a long Tailwind CSS class name.
    
    ![image.png](image 1.png)
    
- Each chart entry with an actual artist’s name and song are in a ‘span’ block with class name `“line-clamp-1”`
    
    ![image.png](image 2.png)
    
- This specific html block could be retrieved with:
    
    ```python
    songs = soup.find_all("span", attrs={'class':"line-clamp-1"})
    print(songs)
    print(len(songs))
    ```
    
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
    
    - At first, I used `find_all(attrs={'class':"line-clamp-1"})` but this also retrieved the currently playing song at the bottom of the webpage. But that song is not in a `span` block but in a `p` block, so I was able to only retrieve the 500 songs from the playlist chart.
- Next, the response was transferred to a DataFrame with an index, the artist name and the song name.
- At first, I got this error: `ValueError: If using all scalar values, you must pass an index`. This occurs when you’re trying to create a DataFrame from scalar values without providing an index (source: [https://saturncloud.io/blog/resolving-valueerror-if-using-all-scalar-values-you-must-pass-an-index-when-merging-multiple-dataframes/](https://saturncloud.io/blog/resolving-valueerror-if-using-all-scalar-values-you-must-pass-an-index-when-merging-multiple-dataframes/)).
- Creating a DataFrame using `.from_dict` automatically includes an Index.
- The DataFrame was then exported to Excel simply with Pandas’ `.to_excel` function.

### 2nd part - Spotify API

<aside>
<img src="https://app.notion.com/icons/report_blue.svg" alt="https://app.notion.com/icons/report_blue.svg" width="40px" />

`make_spotify_playlist_from_excel.py`

`search.py`

</aside>

- Authenticate with the Spotify API: paste the code behind the Google address as response from the first authentication call in your IDE.
    
    ![image.png](2ad83eb4-5ee9-43ad-9e6b-145e1d7e8f34.png)
    
- Creating a Python script that connects with the Spotify API through the `Spotipy` Python library.
- When executing the `make_spotify_playlist_from_excel.py` script it returned several times an error because the webscraped chart data contained some spelling errors. The Spotify API couldn’t handle these because it has no (fuzzy) search margin. A simple search `search.py` script was used to search for songs via the Spotify API to get their correct name.
- Web scraping part could contain spelling errors, as was the case in the following instances:
    - Green Day - “Good Riddance (Time of Our Lives)” should be: “Good Riddance (Time of *Your Life*)”
    - KLF - “Last Train To Transcentral” should be: “Last Train To Trancentral”
    - Iggy Pop & Kate Pierson - Candy → Iggy Pop - Candy
    - Baz Luhrmann - Everybody's Free (To Wear Sunscreen) → 90s Classics - Everybody's Free (To Wear Sunscreen)
- Changed these in the web scraped Excel.
- Now we got success!
    
    ![image.png](image%202.png)
    
    ![image.png](image%203.png)
    

### Resources

- https://kink.nl/nieuws/kink-90s-top-500-2025
- https://www.crummy.com/software/BeautifulSoup/bs4/doc/
- https://developer.spotify.com/documentation/web-api
- https://www.youtube.com/watch?v=WAmEZBEeNmg
- Python libraries used:
    
    ```python
    import requests
    from bs4 import BeautifulSoup
    
    import os
    import pandas as pd
    from dotenv import load_dotenv
    
    import spotipy
    from spotipy.oauth2 import SpotifyOAuth
    ```
    

### Things I learned

- Using `BeautifulSoup4` in a real project and from a real third-party website.
    - Used some examples from Codecademy’s lesson on web scraping with `BeautifulSoup4`
    - https://www.crummy.com/software/BeautifulSoup/bs4/doc/
    - https://kink.nl/nieuws/kink-90s-top-500-2025
- A refresher on the workings of Pandas:
    - https://saturncloud.io/blog/resolving-valueerror-if-using-all-scalar-values-you-must-pass-an-index-when-merging-multiple-dataframes/
    - https://medium.com/data-science/efficiently-iterating-over-rows-in-a-pandas-dataframe-7dd5f9992c01
        - Used `df[’column’].to_list()` for faster iteration, beause `.iterrows()` from Pandas itself is way slower as stated in the article.
- Python Environments Variables for API calls:
    - https://www.codecademy.com/article/python-environment-variables
- Spotify API with the `Spotipy` Python library:
    - https://spotipy.readthedocs.io/en/2.22.1/#
        - `sp = spotipy.Spotify(auth_manager=SpotifyOAuth())`
            - `scope = 'playlist-modify-private’`
        - `user_id = sp.current_user()["id"]`
        - `new_playlist = sp.user_playlist_create(user=user_id, name=”[…]”)`
        - `track_results = sp.search(q=f"track:{song} artist:{artist}", type='track')`
        - `sp.playlist_add_items(new_playlist['id'], [track_results['tracks']['items'][0]['uri']])`
    - https://www.youtube.com/watch?v=WAmEZBEeNmg

### Skills / Python tricks I learned

- See above