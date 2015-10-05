#!/bin/sh

git clone -b next git@github.com:jbaicoianu/elation.git
cd elation
git submodule update --init git@github.com:jbaicoianu/elation-engine.git components/engine
git submodule update --init git@github.com:jbaicoianu/cyclone-physics-js.git components/physics
git submodule add git@github.com:jbaicoianu/elation-share components/share
git submodule add git@github.com:jbaicoianu/internetVRchive.git components/internetVRchive

cd components/engine
git pull origin master
cd ../components/physics
git pull origin master

./elation web init
./elation component enable engine
./elation component enable physics
./elation component enable share
./elation component enable internetVRchive

