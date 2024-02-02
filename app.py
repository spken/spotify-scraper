from flask import Flask, jsonify, redirect, render_template, request, session
from dotenv import load_dotenv
from flask_cors import CORS

import spotipy
from spotipy.oauth2 import SpotifyOAuth

import os
import uuid

load_dotenv()

app = Flask(__name__, template_folder='templates')
app.secret_key = str(uuid.uuid4())
CORS(app)

client_id = os.getenv('SPOTIPY_CLIENT_ID')
client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')
redirect_uri = os.getenv('SPOTIPY_REDIRECT_URI')

cache_handler = spotipy.cache_handler.FlaskSessionCacheHandler(session)
scope = 'user-library-read user-read-currently-playing'
auth_manager = SpotifyOAuth(
    client_id=client_id,
    client_secret=client_secret,
    redirect_uri=redirect_uri,
    scope=scope,
    show_dialog=True,
    cache_handler=cache_handler
)


@app.route('/')
def start():
    return render_template('index.html')


@app.route('/auth')
def authorize():
    # get the authorization url
    auth_url = auth_manager.get_authorize_url()

    # return the authorization url as json
    return jsonify({'auth_url': auth_url})


@app.route('/callback')
def callback():
    # callback endpoint to handle the authorization response
    code = request.args.get('code')
    if code:
        return render_template('pages/success.html')
    else:
        return render_template('pages/error.html')


@app.route('/current')
def currentTrack():
    # check if token is valid
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/auth')

    # attempt to refresh token if expired
    if auth_manager.is_token_expired(cache_handler.get_cached_token()):
        try:
            new_token_info = auth_manager.refresh_access_token(cache_handler.get_cached_token()['refresh_token'])
            cache_handler.save_token(new_token_info)
        except Exception as e:
            return jsonify({'error': f'Token refresh failed: {str(e)}'})

    sp = spotipy.Spotify(auth_manager=auth_manager, cache_handler=cache_handler)
    current_track = sp.current_user_playing_track()
    
    if current_track:
        return jsonify(current_track)
    else:
        return jsonify({'message': 'No track is playing right now.'})


if __name__ == '__main__':
    app.run()
