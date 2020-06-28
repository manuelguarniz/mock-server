let fs = require('fs');
let rxJs = require('rxjs');

const fakeApiReactive$ = (mainDir) => {
  return new rxJs.Observable(subscriber => {
    fs.readdir(`${mainDir}\\mocks`,
      (err, files) => {
        if (err) {
          console.error('ERROR: ', err);
          subscriber.next({});
        } else {
          let maxFiles = files.length;
          for (const file of files) {
            fs.readFile(`${mainDir}\\mocks\\${file}`,
              'utf8',
              (err, data) => {
                if (err) {
                  subscriber.next({});
                } else {
                  maxFiles--;
                  subscriber.next(JSON.parse(data));
                  if (maxFiles === 0) {
                    subscriber.complete();
                  }
                }
              })
          }
        }
      });
  });
}

exports.fakeApiReactive = fakeApiReactive$;
