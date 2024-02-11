"""
This module contains a Flask application for Spotify authorization and data retrieval.
"""

import os
import uuid
import spotipy
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, render_template, request, session
from flask_cors import CORS
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()

app = Flask(__name__, template_folder="templates")
app.secret_key = str(uuid.uuid4())
CORS(app)

client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
redirect_uri = os.getenv("SPOTIPY_REDIRECT_URI")

CACHE_HANDLER = spotipy.cache_handler.FlaskSessionCacheHandler(session)
SCOPE = "user-library-read user-read-currently-playing user-top-read"
AUTH_MANAGER = SpotifyOAuth(
    client_id=client_id,
    client_secret=client_secret,
    redirect_uri=redirect_uri,
    scope=SCOPE,
    show_dialog=True,
    cache_handler=CACHE_HANDLER,
)


@app.route("/")
def index():
    """
    Renders index on application launch
    """
    return render_template("index.html")


@app.route("/about")
def about():
    """
    Renders about page
    """
    return render_template("pages/about.html")


@app.route("/privacy")
def privacy():
    """
    Renders privacy policy page
    """
    return render_template("pages/privacy.html")


@app.route("/auth")
def authorize():
    """
    Handles spotify authorization flow
    """
    auth_url = AUTH_MANAGER.get_authorize_url()
    return jsonify({"auth_url": auth_url})


@app.route("/callback")
def callback():
    """
    Callback endpoint to handle the authorization response
    """
    code = request.args.get("code")
    if code:
        token_info = AUTH_MANAGER.get_access_token(code)
        CACHE_HANDLER.save_token_to_cache(token_info=token_info)
        return redirect("/success")
    return render_template("pages/error.html")


@app.route("/success")
def success():
    """
    Renders the success template
    """
    return render_template("pages/success.html")


@app.route("/logout")
def logout():
    """
    Clears user session
    """
    session.clear()
    return jsonify({"logout": "/"})


def check_token():
    """
    Check / refresh token if expired
    """
    token_info = CACHE_HANDLER.get_cached_token()
    if not token_info or not AUTH_MANAGER.validate_token(token_info):
        try:
            if token_info:
                new_token_info = AUTH_MANAGER.refresh_access_token(token_info["refresh_token"])
                CACHE_HANDLER.save_token_to_cache(new_token_info)
            else:
                raise ValueError("Cached token not found.")
        except ValueError as e:
            print(e)
            return redirect("/")


def get_spotify_instance():
    """
    Get Spotify instance
    """
    check_token()
    return spotipy.Spotify(auth_manager=AUTH_MANAGER)


@app.route("/top-artists/<time_range>")
def top_artists(time_range):
    """
    Gets the users top 10 artists
    """
    sp = get_spotify_instance()
    artists = sp.current_user_top_artists(limit=10, time_range=time_range)
    if artists:
        return jsonify({"artists": artists})
    return jsonify({"artists": "Artist information not found."})


@app.route("/top-tracks/<time_range>")
def top_tracks(time_range):
    """
    Gets the users top 10 tracks
    """
    sp = get_spotify_instance()
    tracks = sp.current_user_top_tracks(limit=10, time_range=time_range)
    if tracks:
        return jsonify({"tracks": tracks})
    return jsonify({"tracks": "Track information not found."})


if __name__ == "__main__":
    app.run()
