var t = require('assert');
var _ = require('lodash');
var Generator = require('../lib/generator');

suite('Generator', function () {
  setup(function () {
    // ...
  });

  suite('.getTemplatesSync', function () {
    test('should only return the Node.js template', function () {
      Generator.getTemplatesSync().map(function (template) {
        return template.fullOutputPath;
      }).should.eql([require('path').resolve(__dirname, '../platform/node/index.js')]);
    });

    test('should return an array', function () {
      t.ok(_.isArray(Generator.getTemplatesSync()));
    });

    test('should return an array of object', function () {
      Generator.getTemplatesSync().forEach(function (v) {
        t.ok(_.isPlainObject(v));
      });
    });
  });

  suite('.parsePath', function () {
    test('should parse specified path', function () {
      var fullpath = "/a/b/c/mailchecker/platform/node/index.tmpl.js";
      var r = Generator.parsePath(fullpath);
      r.should.eql({
        fullpath: fullpath,
        fullOutputPath: "/a/b/c/mailchecker/platform/node/index.js",
        dir: "/a/b/c/mailchecker/platform/node",
        template: "index.tmpl.js",
        output: "index.js"
      });

    });
  });

  suite('.getDomainList', function () {
    test('should return a non-empty list of lowercase strings', function () {
      var r = Generator.getDomainList();

      r.length.should.be.above(0);

      r.map(function (domain) {
        domain.should.eql(domain.toLowerCase());
      });
    });
  });

  suite('.compile', function () {
    test('should compile all templates', function (tdone) {
      // Generator.on('*', function (template) {
      //   console.info(this.event, template.template);
      // });
      Generator.compile(function (err) {
        t.deepEqual(err, null);
        tdone();
      });
    });
  });
});
