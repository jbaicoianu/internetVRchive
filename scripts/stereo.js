elation.require(['engine.things.generic', 'engine.things.sound'], function() {
  /**
   * elation.engine.things.stereo
   * Represents a stereo in the game world.  Drop tapes in to set the platlist
   */
  elation.component.add('engine.things.stereo', function() {
    this.postinit = function() {
      this.defineProperties({
        'playlist': { type: 'string' }
      });
      this.addTag('usable');
      //elation.events.add(this, 'thing_use_activate', this);
      Object.defineProperty(this, 'playing', { get: elation.bind(this, function() { return this.audio.playing; })});
    }
    this.createChildren = function() {
      this.audio = this.spawn('sound', null, { src: this.properties.playlist});
      this.play();
    }
    this.play = function() {
      if (!this.playing) {
        this.audio.play();
      }
    }
    this.pause = function() {
      if (this.playing) {
        this.audio.pause();
      }
    }
    this.stop = function() {
      if (this.playing) {
        this.audio.stop();
      }
    }
    this.setPlaylist = function(url) {
      this.stop();
      this.properties.playlist = url;
      // TODO - these aren't really playlists right now, just individual tracks.  Parsing the m3u file would be easy though.
      this.audio.load(url);
    }
    this.canUse = function(object) {
      if (object.type == 'player') {
        if (object.holding && object.holding.type == 'stereo_cassette') {
          // holding a cassette tape, swap tapes and play it
          return {
            verb: 'play',
            noun: object.holding.properties.label,
            action: elation.bind(this, this.swapTapes, object.holding)
          };
        } else if (this.playing) {
          // Player isn't holding a cassette, if we're playing then pause
          return {
            verb: 'pause',
            action: elation.bind(this, this.pause)
          };
        } else if (this.holding) {
          return {
            verb: 'resume',
            noun: this.holding.properties.label,
            action: elation.bind(this, this.play)
          };
        }
      }
    }
    this.swapTapes = function(tape, player) {
      player.holding = false; // FIXME - weird
      if (this.holding) { // drop the existing tape
        player.pickup(this.holding, true);
        this.holding = false;
      }

      tape.reparent(this);
      tape.properties.position.set(0,0,0);
      this.holding = tape;
      this.setPlaylist(tape.properties.src);
    }
  }, elation.engine.things.generic);
});
