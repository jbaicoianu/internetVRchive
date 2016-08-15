elation.require(['engine.things.generic', 'engine.things.sound'], function() {
  /**
   * elation.engine.things.book
   * Represents an interactive book in 3d.  Pass it the URL to an archive.org metadata.xml file
   * to view that book's contents
   */
  elation.component.add('engine.things.book', function() {
    this.postinit = function() {
      this.defineProperties({
        'src': { type: 'string' }
      });

      this.pages = {};
      this.numpages = 1;
      this.currentpage = 1;
      if (this.properties.src) {
        elation.net.get(this.properties.src, null, { callback: elation.bind(this, this.processBook) });
      }
      elation.events.add(this, 'click', this);
    }
    this.createChildren = function() {
      this.flipsound = this.spawn('sound', null, {
        persist: true,
        src: "/media/internetVRchive/audio/page-flip-02.mp3",
        loop: false,
        autoplay: false
      });

      // FIXME - dumb hack for demo!
      var collgeo = new THREE.BoxGeometry(.26,.040,.297);
      var collmat = new THREE.MeshLambertMaterial({color: 0x990000, transparent: true, opacity: .5});
      var collider_left = new THREE.Mesh(collgeo, collmat);
      collider_left.userData.thing = this;
      collider_left.userData.side = 'left';
      collider_left.position.set(-.26/2, .010, -.020);
      this.colliders.add(collider_left);
      collider_left.updateMatrixWorld();

      var collider_right = new THREE.Mesh(collgeo, collmat)
      collider_right.userData.thing = this;
      collider_right.userData.side = 'right';
      collider_right.position.set(.26/2, .010, -.020);
      this.colliders.add(collider_right);
      collider_right.updateMatrixWorld();
    }
    this.processBook = function(response) {
      var xml = elation.utils.parseXML(response);
      if (xml && xml.metadata) {
        this.title = elation.utils.arrayget(xml, 'metadata._children.title._content');
        this.numpages = elation.utils.arrayget(xml, 'metadata._children.imagecount._content');
        this.identifier = elation.utils.arrayget(xml, 'metadata._children.identifier._content');

        this.setPage(1);
      }
    }
    this.fetchPage = function(pagenum) {
      var newpage = Math.min(this.numpages-1, pagenum);
      var pageid_left = ('000' + newpage).slice(-4);
      var pageid_right = ('000' + (newpage+1)).slice(-4);
      var pageext = 'jpg';

      var pagebase = 'http://cors.archive.org/cors/' + this.identifier + '/' + this.identifier + '_jp2.zip/' + this.identifier + '_jp2%2F' + this.identifier + '_';
      // Unfortunately the archive.org zipfile viewer does not send CORS headers, so we have to proxy images loads through our own server
      if (!this.pages[pageid_left]) {
        this.pages[pageid_left] = elation.engine.materials.getTexture('/internetVRchive/cors?url=' + encodeURIComponent(pagebase + pageid_left + '.' + pageext));
      }
      if (!this.pages[pageid_right]) {
        this.pages[pageid_right] = elation.engine.materials.getTexture('/internetVRchive/cors?url=' + encodeURIComponent(pagebase + pageid_right + '.' + pageext));
      }
    }
    this.setPage = function(pagenum) {
      if (this.parts['page_left']) {
        var newpage = Math.min(this.numpages-1, pagenum),
            pageid_left = ('000' + newpage).slice(-4),
            pageid_right = ('000' + (newpage+1)).slice(-4);

        this.currentpage = pagenum;

        this.fetchPage(pagenum);

        this.parts['page_left'].children[0].material.map = this.pages[pageid_left];
        this.parts['page_right'].children[0].material.map = this.pages[pageid_right];
        this.parts['page_left'].children[0].material.specular.setHex(0x060606);
        this.parts['page_right'].children[0].material.specular.setHex(0x060606);
        //this.parts['page_right'].children[0].material.specular = 0;
        console.log(this.parts['page_right'].children[0].material);

        // Prefetch the next 4 pages (two page flips), to avoid delays
        this.fetchPage(pagenum + 2);
        this.fetchPage(pagenum + 4);
      } else {
        elation.events.add(this, 'resource_load_finish', elation.bind(this, this.setPage, pagenum));
      }
      this.refresh();
    }
    this.click = function(ev) {
      // Don't go past the end of the book
      var side = ev.data.object.userData.side;
      var newpage = Math.max(1, Math.min(this.numpages-1, this.currentpage + (side == 'right' ? 2 : -2)));
console.log('page is now ' + newpage);
      this.setPage(newpage);
      this.flipsound.play();
    }
  }, elation.engine.things.generic);
});
