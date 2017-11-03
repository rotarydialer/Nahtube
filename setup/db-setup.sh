# This script does initial setup of the Postgres db

echo "Opening Postgres..."
echo "Once connected, type \"\\password postgres\" and enter a password."
echo "Then type \"\\q\" to quit."
sudo -u postgres psql postgres

sudo -u postgres createdb nahdb
