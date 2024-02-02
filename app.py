from flask import Flask, jsonify, render_template, request
from dotenv import load_dotenv
from flask_cors import CORS

import spotipy
from spotipy.oauth2 import SpotifyOAuth

import os

load_dotenv()

app = Flask(__name__, template_folder='templates')
CORS(app)

client_id = os.getenv('SPOTIPY_CLIENT_ID')
client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')
redirect_uri = os.getenv('SPOTIPY_REDIRECT_URI')

access_token = ''


@app.route('/', methods=['GET'])
def start():
    return render_template('index.html')


@app.route('/auth', methods=['GET'])
def authorize():
    scope = 'user-library-read user-read-playback-state'
    sp_oauth = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope
    )

    # get the authorization URL
    auth_url = sp_oauth.get_authorize_url()

    print(auth_url)

    # return the authorization URL as JSON
    return jsonify({'auth_url': auth_url})


@app.route('/callback', methods=['GET'])
def callback():
    # callback endpoint to handle the authorization response
    code = request.args.get('code')
    if code:
        sp_oauth = SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri
        )

        # get access and refresh tokens
        token_info = sp_oauth.get_access_token(code)
        access_token = token_info['access_token']
        refresh_token = token_info['refresh_token']

        return render_template('pages/success.html')
    else:
        return render_template('pages/error.html')


@app.route('/current')
def currentTrack():
    sp = spotipy.Spotify(auth=access_token)
    current_track = sp.current_user_playing_track()
    return jsonify({'current_track': current_track})


if __name__ == '__main__':
    app.run()
