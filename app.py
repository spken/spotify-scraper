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
def start():
    """
    Renders index on application launch
    :return: Rendered index
    """
    return render_template("index.html")


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


@app.route("/current-track")
def current_track():
    """
    Gets a users current track (if one is playing)
    :return: Track information
    """
    # check if token is valid
    if not AUTH_MANAGER.validate_token(CACHE_HANDLER.get_cached_token()):
        return redirect("/auth")

    # attempt to refresh token if expired
    if AUTH_MANAGER.is_token_expired(CACHE_HANDLER.get_cached_token()):
        try:
            new_token_info = AUTH_MANAGER.refresh_access_token(
                CACHE_HANDLER.get_cached_token()["refresh_token"]
            )
            CACHE_HANDLER.save_token_to_cache(new_token_info)
        except Exception as e:
            return jsonify({"current_track": f"Token refresh failed: {str(e)}"})

    sp = spotipy.Spotify(auth_manager=AUTH_MANAGER)
    track = sp.current_user_playing_track()

    if track:
        return jsonify({"current_track": track})
    else:
        return jsonify({"current_track": "No track is playing right now."})


@app.route("/top-artists")
def top_artists():
    """
    Gets the users top 10 artists
    :return: Top 10 artists for user
    """
    # check if token is valid
    if not AUTH_MANAGER.validate_token(CACHE_HANDLER.get_cached_token()):
        return redirect("/auth")

    # attempt to refresh token if expired
    if AUTH_MANAGER.is_token_expired(CACHE_HANDLER.get_cached_token()):
        try:
            new_token_info = AUTH_MANAGER.refresh_access_token(
                CACHE_HANDLER.get_cached_token()["refresh_token"]
            )
            CACHE_HANDLER.save_token_to_cache(new_token_info)
        except Exception as e:
            return jsonify({"error": f"Token refresh failed: {str(e)}"})

    sp = spotipy.Spotify(auth_manager=AUTH_MANAGER)
    artists = sp.current_user_top_artists(limit=10, time_range="short_term")

    if artists:
        return jsonify({"artists": artists})
    else:
        return jsonify({"artists": "Artist information not found."})
    

@app.route("/top-tracks")
def top_tracks():
    """
    Gets the users top 10 tracks
    :return: Top 10 tracks for user
    """
    # check if token is valid
    if not AUTH_MANAGER.validate_token(CACHE_HANDLER.get_cached_token()):
        return redirect("/auth")

    # attempt to refresh token if expired
    if AUTH_MANAGER.is_token_expired(CACHE_HANDLER.get_cached_token()):
        try:
            new_token_info = AUTH_MANAGER.refresh_access_token(
                CACHE_HANDLER.get_cached_token()["refresh_token"]
            )
            CACHE_HANDLER.save_token_to_cache(new_token_info)
        except Exception as e:
            return jsonify({"error": f"Token refresh failed: {str(e)}"})

    sp = spotipy.Spotify(auth_manager=AUTH_MANAGER)
    tracks = sp.current_user_top_tracks(limit=10, time_range="short_term")

    if tracks:
        return jsonify({"tracks": tracks})
    else:
        return jsonify({"tracks": "Track information not found."})


if __name__ == "__main__":
    app.run()
