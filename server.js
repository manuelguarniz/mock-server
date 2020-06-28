let express = require('express');
let bodyParser = require('body-parser');
let buildApi = require('./core/build-apis');
let rxJs = require('rxjs');
let rxOp = require('rxjs/operators');
let map = rxOp.map;

let server = express();
let router = express.Router();
let port = 8082;
// let executorFakeMethods = new rxJs.BehaviorSubject(null);
// let listenerFameMethod$ = executorFakeMethods.asObservable();

server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  next();
});

server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// let finalizeConfigRouter = new Promise((resolve, reject) => {
// });

router.get('/api/hello', (req, res, next) => {
  res.status(200).json({ say: 'Hello World!' });
});

buildApi.fakeApiReactive(__dirname).subscribe(
  res => {
    for (const api of Object.keys(res)) {
      for (const method of res[api]) {
        const typeMethod = Object.keys(method)[0];
        const responseJson = method[typeMethod];
        let router = express.Router();

        if (typeMethod === 'POST') {
          router.post(api, (req, res, next) => {
            res.status(200).json(responseJson);
          });
        }
        if (typeMethod === 'GET') {
          router.get(api, (req, res, next) => {
            res.status(200).json(responseJson);
          });
        }
        console.log('api -> ', api);
        console.log('typeMethod -> ', typeMethod);
      }
    }
  }, err => {
    console.error('Error fakeApiReactive: ', err);
  }, () => {
    console.error('FINISH config router');
    server.use(router);
    console.log('router -> ', router.length)

    server.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  });


// server.use(router);

server.use((req, res, next) => {
  console.log(req.url);
  responseCustom = {
   statusCode: 404,
   message: 'URL not found'
  };
  res.status(404).json(responseCustom);
 });

// server.listen(port, () => {
//   console.log(`Express server listening on port ${port}`);
// });
