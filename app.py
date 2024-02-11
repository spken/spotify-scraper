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
    :return: Rendered index
    """
    return render_template("index.html")


@app.route("/about")
def about():
    """
    Renders about page
    :return: Rendered about page
    """
    return render_template("pages/about.html")


@app.route("/privacy")
def privacy():
    """
    Renders privacy policy page
    :return: Rendered privacy policy page
    """
    return render_template("pages/privacy.html")


@app.route("/auth")
def authorize():
    """
    Handles spotify authorization flow
    :return: Authorization URL for spotify
    """
    # get the authorization url
    auth_url = AUTH_MANAGER.get_authorize_url()

    # return the authorization url as json
    return jsonify({"auth_url": auth_url})


@app.route("/callback")
def callback():
    """
    Callback endpoint to handle the authorization response
    :return: A redirect to success / error page
    """
    code = request.args.get("code")
    if code:
        token_info = AUTH_MANAGER.get_access_token(code)
        CACHE_HANDLER.save_token_to_cache(token_info=token_info)

        return redirect("/success")
    else:
        return render_template("pages/error.html")


@app.route("/success")
def success():
    """
    Renders the success template
    :return: Render of success page
    """
    return render_template("pages/success.html")


@app.route("/logout")
def logout():
    """
    Clears user session
    :return: Default endpoint on logout
    """
    session.clear()
    return jsonify({"logout": "/"})


def check_token():
    """
    Check / refresh token if expired
    :return: Redirect to index / error json on exception
    """
    token_info = CACHE_HANDLER.get_cached_token()

    # check if token is valid
    if not token_info or not AUTH_MANAGER.validate_token(token_info):
        try:
            if token_info:
                new_token_info = AUTH_MANAGER.refresh_access_token(token_info["refresh_token"])
                CACHE_HANDLER.save_token_to_cache(new_token_info)
            else:
                raise Exception("Cached token not found.")
        except Exception as e:
            print(e)
            return redirect("/")


def get_spotify_instance():
    """
    Get Spotify instance
    :return: Spotify instance
    """
    check_token()
    return spotipy.Spotify(auth_manager=AUTH_MANAGER)


@app.route("/top-artists/<time_range>")
def top_artists(time_range):
    """
    Gets the users top 10 artists
    :return: Top 10 artists for user
    """
    sp = get_spotify_instance()
    artists = sp.current_user_top_artists(limit=10, time_range=time_range)

    if artists:
        return jsonify({"artists": artists})
    else:
        return jsonify({"artists": "Artist information not found."})


@app.route("/top-tracks/<time_range>")
def top_tracks(time_range):
    """
    Gets the users top 10 tracks
    :return: Top 10 tracks for user
    """
    sp = get_spotify_instance()
    tracks = sp.current_user_top_tracks(limit=10, time_range=time_range)

    if tracks:
        return jsonify({"tracks": tracks})
    else:
        return jsonify({"tracks": "Track information not found."})


if __name__ == "__main__":
    app.run()
