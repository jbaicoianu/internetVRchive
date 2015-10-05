#!/bin/sh

sudo apt-get update
sudo apt-get install git apache2 php5 libapache2-mod-php5 smarty3 php5-memcache

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

