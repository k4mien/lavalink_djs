# Lavalink Music Bot
Powerful discord music bot using Lavalink and DiscordJS

## Table of contents
* [Features](#features)
* [To do](#to-do)
* [Installation](#installation)
* [References](#references)

## Features
- easy to use
- configurable
- clean/not bloated code
- minimal cpu/ram usage
- yt/spotify/soundcloud support
- plugins
- and much more can be added!

## To do
- implement redis queue storage
- scalability

## Installation

1. Git clone this repo
```bash
git clone https://github.com/k4mien/lavalink_djs.git
```
2. Change directory to project
```bash
cd lavalink_djs
```
3. Rename .env.example to bot.env
```bash
mv .env.example bot.env
```
4. Fill .env file with your settings
```bash
TOKEN=. # token from dc dev page

PREFIX=!

CLIENT_ID=. # bot id

GUILD_ID=. # guild id

PRODUCTION=true

LAVALINK_PORT=2333 # default lavalink port

LAVALINK_PASS=testpass # only for tutorial

LAVALINK_NAME=lavalink

LAVALINK_ID=lavalink-node

```
5. Rename application-example.env to application.env
```bash
mv application-example.env application.env
```
6. Fill .env file with your settings
```bash
SERVER_PORT=2333 # default lavalink port
SERVER_ADDRESS=0.0.0.0 # localhost
SERVER_HTTP2_ENABLED=false

PLUGINS_LAVASRC_SPOTIFY_CLIENTID=. # for spotify support, you have to provide clientid from dev page
PLUGINS_LAVASRC_SPOTIFY_CLIENTSECRET=. # for spotify support, you have to provide clientsecret from dev page
PLUGINS_LAVASRC_SOURCES_SPOTIFY=true
PLUGINS_LAVASRC_SOURCES_YOUTUBE=true
PLUGINS_LAVASRC_SPOTIFY_COUNTRYCODE=PL
PLUGINS_LAVASRC_SPOTIFY_PLAYLISTLOADLIMIT=6
PLUGINS_LAVASRC_SPOTIFY_ALBUMLOADLIMIT=6

LAVALINK_PLUGINS_0_DEPENDENCY=com.github.topi314.lavasrc:lavasrc-plugin:4.0.1 # plugin, adds support for spotify search

LAVALINK_SERVER_PASSWORD=testpass # only for tutorial
LAVALINK_SERVER_SOURCES_YOUTUBE=true
LAVALINK_SERVER_SOURCES_BANDCAMP=false
LAVALINK_SERVER_SOURCES_SOUNDCLOUD=true
LAVALINK_SERVER_SOURCES_TWITCH=true
LAVALINK_SERVER_SOURCES_VIMEO=false
LAVALINK_SERVER_SOURCES_HTTP=true
LAVALINK_SERVER_SOURCES_LOCAL=false

LAVALINK_SERVER_FILTERS_VOLUME=true
LAVALINK_SERVER_FILTERS_EQUALIZER=true
LAVALINK_SERVER_FILTERS_KARAOKE=true
LAVALINK_SERVER_FILTERS_TIMESCALE=true
LAVALINK_SERVER_FILTERS_TREMOLO=true
LAVALINK_SERVER_FILTERS_VIBRATO=true
LAVALINK_SERVER_FILTERS_DISTORTION=true
LAVALINK_SERVER_FILTERS_ROTATION=true
LAVALINK_SERVER_FILTERS_CHANNEL_MIX=true
LAVALINK_SERVER_FILTERS_LOW_PASS=true

LAVALINK_SERVER_BUFFER_DURATION_MS=400
LAVALINK_SERVER_FRAME_BUFFER_DURATION_MS=5000
LAVALINK_SERVER_OPUS_ENCODING_QUALITY=10
LAVALINK_SERVER_RESAMPLING_QUALITY=LOW
LAVALINK_SERVER_TRACK_STUCK_THRESHOLD_MS=10000
LAVALINK_SERVER_USE_SEEK_GHOSTING=true
LAVALINK_SERVER_YOUTUBE_PLAYLIST_LOAD_LIMIT=6

LAVALINK_SERVER_PLAYER_UPDATE_INTERVAL=5
LAVALINK_SERVER_YOUTUBE_SEARCH_ENABLED=true
LAVALINK_SERVER_SOUNDCLOUD_SEARCH_ENABLED=true

LAVALINK_SERVER_GC_WARNINGS=true

METRICS_PROMETHEUS_ENABLED=false
METRICS_PROMETHEUS_ENDPOINT=/metrics

LOGGING_FILE_PATH=./logs/
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_LAVALINK=INFO

LOGGING_REQUEST_ENABLED=true
LOGGING_REQUEST_INCLUDE_CLIENT_INFO=true
LOGGING_REQUEST_INCLUDE_HEADERS=false
LOGGING_REQUEST_INCLUDE_QUERY_STRING=true
LOGGING_REQUEST_INCLUDE_PAYLOAD=true
LOGGING_REQUEST_MAX_PAYLOAD_LENGTH=10000

LOGGING_LOGBACK_ROLLINGPOLICY_MAX_FILE_SIZE=1GB
LOGGING_LOGBACK_ROLLINGPOLICY_MAX_HISTORY=30
```
7. Start docker compose
```bash
docker compose -f compose-prod.yml up
```
Enjoy music :)

## References
lavalink-client: https://github.com/Tomato6966/lavalink-client \
Lavalink: https://github.com/lavalink-devs/Lavalink
