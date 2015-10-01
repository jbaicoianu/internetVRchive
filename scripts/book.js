elation.require(['engine.things.generic', 'engine.things.sound'], function() {
  elation.component.add('engine.things.book', function() {
    this.postinit = function() {
      this.defineProperties({
        'src': { type: 'string' }
      });

      this.pages = {};
      if (this.properties.src) {
        elation.net.get(this.properties.src, null, { callback: elation.bind(this, this.processBook) });
      }
      elation.events.add(this, 'click', this);
    }
    this.createChildren = function() {
      this.flipsound = this.spawn('sound', null, {
        persist: true,
        src: "/media/vrcade/models/books/page-flip-02.mp3",
        loop: false,
        autoplay: false
      });
    }
    this.processBook = function(response) {
      var xml = elation.utils.parseXML(response);
      console.log('got the book', xml);
      if (xml && xml.metadata) {
        this.title = elation.utils.arrayget(xml, 'metadata._children.title._content');
        this.numpages = elation.utils.arrayget(xml, 'metadata._children.imagecount._content');
        this.identifier = elation.utils.arrayget(xml, 'metadata._children.identifier._content');

        this.setPage(1);
      }
    }
    this.prefetch = function(pagenum) {
      var newpage = Math.min(this.numpages-1, pagenum);
      var pageid_left = ('000' + newpage).slice(-4);
      var pageid_right = ('000' + (newpage+1)).slice(-4);

      var pagebase = 'http://cors.archive.org/cors/' + this.identifier + '/' + this.identifier + '_jp2.zip/' + this.identifier + '_jp2%2F' + this.identifier + '_';
      if (!this.pages[pageid_left]) {
        this.pages[pageid_left] = elation.engine.materials.getTexture('/engine/cors?url=' + encodeURIComponent(pagebase + pageid_left + '.jpg'));
      }
      if (!this.pages[pageid_right]) {
        this.pages[pageid_right] = elation.engine.materials.getTexture('/engine/cors?url=' + encodeURIComponent(pagebase + pageid_right + '.jpg'));
      }
      console.log('prefetch!', pageid_left, pageid_right);
    }
    this.setPage = function(pagenum) {
      if (this.parts['page_left']) {
        this.currentpage = pagenum;

        var pageid_left = ('000' + pagenum).slice(-4);
        var pageid_right = ('000' + (pagenum+1)).slice(-4);

        //elation.net.get('/engine/cors', {url: pagebase}, { callback: elation.bind(this, this.setPage, pagenum) });
        var pagebase = 'http://cors.archive.org/cors/' + this.identifier + '/' + this.identifier + '_jp2.zip/' + this.identifier + '_jp2%2F' + this.identifier + '_';
        if (!this.pages[pageid_left]) {
          this.pages[pageid_left] = elation.engine.materials.getTexture('/engine/cors?url=' + encodeURIComponent(pagebase + pageid_left + '.jpg'));
        }
        if (!this.pages[pageid_right]) {
          this.pages[pageid_right] = elation.engine.materials.getTexture('/engine/cors?url=' + encodeURIComponent(pagebase + pageid_right + '.jpg'));
        }

        this.parts['page_left'].children[0].material.color.setHex(0xffffff);
        this.parts['page_right'].children[0].material.color.setHex(0xffffff);

        this.parts['page_left'].children[0].material.map = this.pages[pageid_left];
        this.parts['page_right'].children[0].material.map = this.pages[pageid_right];

        this.prefetch(pagenum + 2);
        this.prefetch(pagenum + 4);
      } else {
        elation.events.add(this, 'resource_load_finish', elation.bind(this, this.setPage, pagenum));
      }
      this.refresh();
    }
    this.click = function(ev) {
      var newpage = Math.min(this.numpages-1, this.currentpage + 2);
      this.setPage(newpage);
console.log(this.flipsound);
      this.flipsound.play();
    }
  }, elation.engine.things.generic);
});
