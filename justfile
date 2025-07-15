default:
	#!/usr/bin/env bash
	if [ ! -f pocketbase ]; then
	  echo "▶ downloading PocketBase…"
	  wget -qO pocketbase.zip \
	    "https://github.com/pocketbase/pocketbase/releases/download/v0.28.4/pocketbase_0.28.4_linux_amd64.zip"
	  unzip -o pocketbase.zip pocketbase
	  rm pocketbase.zip
	  chmod +x pocketbase
	fi
	./pocketbase serve --http 0.0.0.0:8090

