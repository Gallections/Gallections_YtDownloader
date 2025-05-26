from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from pytubefix import YouTube, Playlist
import subprocess
import os
import io
import requests
import time

def download_video(url):
    try:
        yt = YouTube(url, use_po_token=True)
        video_stream = yt.streams.filter(progressive = True).get_highest_resolution()

        filename = f"{yt.title}.mp4".replace("/", "_")

        def generate():
            buffer = io.BytesIO()
            video_stream.stream_to_buffer(buffer)
            buffer.seek(0)
            
            while True:
                chunk = buffer.read(8192)  # Increased chunk size for better performance
                if not chunk:
                    break
                yield chunk

        response = Response(generate(), mimetype = 'video/mp4')
        response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        response.headers['Content-Type'] = 'video/mp4'
        # CORS Headers
        response.headers['Access-Control-Allow-Origin'] = '*'  # Allow any domain
        response.headers['Access-Control-Allow-Headers'] = 'Content-Disposition'
        response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition'

        return response
    except Exception as e:
        print(f"Error downloading the video {str(e)}")
        return jsonify({"Error": str(e)}), 500
    

def download_audio(url):
    try:
        yt = YouTube(url, use_po_token=True)

        audio_stream = yt.streams.filter(only_audio=True).first()
        filename = f"{yt.title}.mp3".replace("/", "_")

        def generate():
            buffer = io.BytesIO()
            audio_stream.stream_to_buffer(buffer)
            buffer.seek(0)
            while True:
                chunk = buffer.read(8192)
                if not chunk:
                    break
                yield chunk

        response = Response(generate(), mimetype = "audio/mp3")
        response.headers["Content-Disposition"] = f'attachment; filename={filename}'
        response.headers['Content-Type'] = "audio/mp3"
        # CORS Headers
        response.headers['Access-Control-Allow-Origin'] = '*'  # Allow any domain
        response.headers['Access-Control-Allow-Headers'] = 'Content-Disposition'
        response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition'


        return response
    except Exception as e:
        print(f"Error Downloading the audio: {str(e)}")
        return jsonify({"error": str(e)}), 500

def download_playlist_videos(url):
    try:
        playlist = Playlist(url)
        def generate():
            for video_url in playlist.video_urls:
                try:
                    yt = YouTube(video_url, use_po_token=True)
                    video_stream = yt.streams.filter(progressive = True).get_highest_resolution()

                    yield b"--video-boundary\n"
                    time.sleep(0.5)
                    yield f"Content-Disposition: attachment; filename=\"{yt.title.replace('/','_')}\"\n\n".encode()
                    time.sleep(0.5)

                    buffer = io.BytesIO()
                    video_stream.stream_to_buffer(buffer)
                    buffer.seek(0)

                    while True:
                        chunk = buffer.read(8192)
                        if not chunk:
                            time.sleep(0.5)
                            break
                        yield chunk
                    
                    buffer.seek(0)
                    buffer.truncate()

                    yield b"separator" 
                    time.sleep(0.5)

                except Exception as video_error:
                    error_message = f"Error downloading video {video_url}: {str(video_error)}\n"
                    yield b"--video-boundary\n"
                    yield f"Content-Type: text/plain\n\n{error_message}".encode()
                
            yield b"--video-boundary--\n"

        response = Response(generate(), mimetype = "multipart/mixed; boundary=video-boundary")
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Disposition"
        response.headers["Access-Control-Expose-Headers"] = "Content-Disposition"

        return response
    
    except Exception as e:
        print(f"Error processing playlist: {str(e)}")
        return jsonify({"Error": str(e)}), 500


def download_playlist_audios(url):
    try:
        playlist = Playlist(url)
        def generate():
            for video_url in playlist.video_urls:
                try:
                    yt = YouTube(video_url, use_po_token=True)
                    video_stream = yt.streams.filter(only_audio = True).first()

                    yield b"--audio-boundary\n"
                    time.sleep(0.5)
                    yield f"Content-Disposition: attachment; filename=\"{yt.title.replace('/','_')}\"\n\n".encode()
                    time.sleep(0.5)

                    buffer = io.BytesIO()
                    video_stream.stream_to_buffer(buffer)
                    buffer.seek(0)

                    while True:
                        chunk = buffer.read(8192)
                        if not chunk:
                            time.sleep(0.5)
                            break
                        yield chunk
                    
                    buffer.seek(0)
                    buffer.truncate()

                    yield b"separator" 
                    time.sleep(0.5)
                    

                except Exception as video_error:
                    error_message = f"Error downloading audio {video_url}: {str(video_error)}\n"
                    yield b"--audio-boundary\n"
                    yield f"Content-Type: text/plain\n\n{error_message}".encode()
                
            yield b"--audio-boundary--\n"

        response = Response(generate(), mimetype = "multipart/mixed; boundary=audio-boundary")
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Disposition"
        response.headers["Access-Control-Expose-Headers"] = "Content-Disposition"

        return response
    
    except Exception as e:
        print(f"Error processing playlist: {str(e)}")
        return jsonify({"Error": str(e)}), 500
