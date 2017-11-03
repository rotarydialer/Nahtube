# This script will do the first-time setup required for this app to run
hr="|-------------------------------------------|"

echo $hr
echo "| START    =================================|"
echo $hr
echo
echo "Beginning first-time setup..."
echo

echo "Installing postgres"
sudo apt-get install postgresql postgresql-contrib

echo
echo "Done."
echo $hr
echo "| END    ===================================|"
echo $hr
