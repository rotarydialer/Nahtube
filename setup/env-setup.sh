# Script to set necessary environment variables
export YOUTUBEDATAAPIKEY='inputkeyhere'
echo "YouTube Data API key: \"$YOUTUBEDATAAPIKEY\""

git update-index --assume-unchanged ./env-setup.sh
