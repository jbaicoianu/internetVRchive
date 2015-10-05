#!/bin/sh

sudo apt-get update
sudo apt-get install -y git apache2 php5 libapache2-mod-php5 smarty3 php5-memcache

git clone -b next https://github.com/jbaicoianu/elation.git
cd elation

# FIXME - these shouldn't be submodules
rm -r components/engine components/physics
git clone https://github.com/jbaicoianu/elation-engine.git components/engine
git clone https://github.com/jbaicoianu/cyclone-physics-js.git components/physics

git clone https://github.com/jbaicoianu/elation-share components/share
git clone https://github.com/jbaicoianu/internetVRchive.git components/internetVRchive

./elation web init
./elation component enable engine
./elation component enable physics
./elation component enable share
./elation component enable internetVRchive

sudo ln -s $HOME/elation /var/www/elation
sudo cp config/apache-elation.conf /etc/apache2/sites-available/
sudo a2enmod rewrite
sudo a2ensite apache-elation
sudo a2dissite 000-default
