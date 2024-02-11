# spotify-scraper

## Table of Contents

* [About](#about)
* [Prerequisites](#prerequisites)
* [Setup](#setup)
* [Usage](#usage)
* [Technologies](#technologies)
* [Author](#author)

## About

spotify-scraper is a web application designed to view your top artists, and top tracks on Spotify for a certain time period. It uses the Spotify authorization flow in order to "grab" the necessary data.

## Prerequisites

Before setting up and running the project, ensure you have the following installed on your machine:

```
- Python - for running the backend server.
- Git - for cloning the repository.
```

## Setup

To get started with the Event-Tool, follow these steps:

1. Clone the repository:

```
$ git clone https://github.com/spken/spotify-scraper.git
$ cd eventtool
```

2. Activate environment:

```
$ source /env/Scripts/activate
```

2. Install requirements:

```
$ pip install -r requirements.txt
```

3. Set up environment variables:

```
# .env file
SPOTIPY_CLIENT_ID=your_spotify_client_id
SPOTIPY_CLIENT_SECRET=your_spotify_client_secret
SPOTIPY_REDIRECT_URI=http://127.0.0.1:5000/callback

FLASK_APP=app
FLASK_ENV=development
```

4. Run flask application:

```
$ flask run
```

## Usage

Once the application is running, you can use it to perform following tasks:

* Log in to Spotify
* View your top artists
    * Last month
    * Last 6 months
    * All time
* View your top tracks
    * Last month
    * Last 6 months
    * All time

For more info, click on the `About` or `Privacy Policy` pages in the navbar.

## Technologies

The spotify-scraper project uses the following technologies and frameworks:

```
- Frontend:
    - HTML, CSS, JavaScript
    - Bootstrap CSS framework (v5.3.0)

- Backend:
    - Python
    - Flask framework (v3.0.1)

- Additional Dependencies (view requirements.txt):
    - Flask-Cors (v4.0.0)
    - Jinja2 (v3.1.3)
    - MarkupSafe (v2.1.4)
    - blinker (v1.7.0)
    - certifi (v2024.2.2)
    - charset-normalizer (v3.3.2)
    - click (v8.1.7)
    - colorama (v0.4.6)
    - idna (v3.6)
    - itsdangerous (v2.1.2)
    - mccabe (v0.7.0)
    - pycodestyle (v2.11.1)
    - pyflakes (v3.2.0)
    - python-dotenv (v1.0.1)
    - redis (v5.0.1)
    - requests (v2.31.0)
    - six (v1.16.0)
    - spotipy (v2.23.0)
    - urllib3 (v2.2.0)
    - uuid (v1.30)
    - Werkzeug (v3.0.1)
```

## Author

[spken](https://github.com/spken)

