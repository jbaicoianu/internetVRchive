elation.require(['engine.things.generic'], function() {
  elation.component.add('engine.things.stereo_cassette', function() {
    this.postinit = function() {
      this.defineProperties({
        'src': { type: 'string' },
        'label': { type: 'string' }
      });
      elation.events.add(this, 'thing_use_activate', this);
      if (this.properties.label) {
        this.setLabel(this.properties.label);
      }
      this.addTag('usable');
    }
    this.createChildren = function() {
    }
    this.setPlaylist = function(url) {
      this.properties.playlist = url;
    }
    this.setLabel = function(text) {
      if (!this.parts['label-side1']) {
        elation.events.add(this, 'resource_load_finish', elation.bind(this, this.setLabel, text));
        return;
      }
      var c = elation.html.create('canvas');
      var ctx = c.getContext('2d');

      //var size = ctx.measureText(text);
      c.width = 512;
      c.height = 32;

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);

      var fontsize = 24;
      ctx.font = fontsize + 'px monospace';
      ctx.fillStyle = '#000';
      ctx.fillText(text, 8, fontsize);

      var tex = new THREE.Texture(c);
      tex.needsUpdate = true;

      this.parts['label-side1'].children[0].material.map = tex;
      this.refresh();
    }
    this.thing_use_activate = function(ev) {
      var player = ev.data;
      if (player) {
        player.pickup(this);
      }
    }
    this.canUse = function(object) {
      return {
        verb: 'pick up',
        noun: this.properties.label
      };
    }
  }, elation.engine.things.generic);
});
