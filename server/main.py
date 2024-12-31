from utils import download_audio, download_video, download_playlist_videos, download_playlist_audios
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from pytubefix import YouTube, Playlist
import subprocess
import os
import io
import requests


app = Flask(__name__)
cors = CORS(app, origins = "*")
# specifify the orgin later

@app.route("/yt_downloader", methods = ["POST"])
def yt_downloader():
    if request.method == 'POST':
        data = request.get_json()
        print("Received request for downloading YouTube URL: ", data)
        url = data.get('url')
        if not url:
            return jsonify({"error": "No URL is provided"})
        
        if data.get("format") == "video":
            return download_video(url)
            
            return jsonify({
                "response": "We are downloading a video"
            })
        
        if data.get("format") == "audio":
            return download_audio(url)
            return jsonify({
                "response": "We are downloading an audio"})
        
@app.route("/yt_playlist_downloader", methods = ["POST"])
def yt_playlist_downloader():
    if request.method == 'POST':
        data = request.get_json()
        print("Received request for downloading youtube playlist URL: ", data)
        url = data.get('url')
        if not url:
            return jsonify({"error": "No URL is provided!"})
        
        if data.get("format") == "video":
            return download_playlist_videos(url)
            
            return jsonify({
                "response": "We are downloading a video"
            })
        
        if data.get("format") == "audio":
            return download_playlist_audios(url)
            return jsonify({
                "response": "We are downloading an audio"})


if __name__ == "__main__":
    app.run(debug = True, port = 8000)
    