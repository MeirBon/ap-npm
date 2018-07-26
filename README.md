# ap-npm

Authenticated Private  NPM Repository

![Build Status](https://travis-ci.org/MeirBon/ap-npm.svg?branch=master)
[![codecov](https://codecov.io/gh/MeirBon/ap-npm/branch/master/graph/badge.svg)](https://codecov.io/gh/MeirBon/ap-npm)
![Licence MIT](https://camo.githubusercontent.com/cf76db379873b010c163f9cf1b5de4f5730b5a67/68747470733a2f2f6261646765732e66726170736f66742e636f6d2f6f732f6d69742f6d69742e7376673f763d313032)

[![dockeri.co](https://dockeri.co/image/meirbon/ap-npm)](https://hub.docker.com/r/meirbon/ap-npm/)

ap-npm runs a npm-repository. 
It should be used together with [npm-scope](https://docs.npmjs.com/misc/scope), 
as ap-npm doesn't function as a caching/proxy server like Sinopia/Verdaccio.

Since 0.2.4 ap-npm has a proxy feature. If a package cannot be found locally, it will proxy the request over to the registry given in the config (**Note: by default this feature is turned off**)

#### Install
```
npm install -g ap-npm
```

##### Start server
```
ap-npm serve
```
##### Setup npm project with ap-npm publishConfig
```
ap-npm init
```
This runs `npm init` in the current folder and adds a publishConfig to the package.json from your ap-npm config

### Creating own auth-provider
ap-npm is written in Typescript and thus writing your own Authentication
 should preferably be done in Typescript as well. Example of using your 
 own AuthProvider:
``` typescript
import { default as ApNpm, AuthProvider } from "ap-npm";

class MyAuthProvider extends AuthProvider {
	userLogin(username: string, password: string, email?: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	userAdd(username: string, password: string, email: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	userRemove(username: string, password: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	userLogout(token: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	verifyToken(token: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
}

const myApplication = new ApNpm ({
	workDir: "/ap-npm",
	storage: {
		directory: "storage",
	},
	port: 4444,
	hostname: "https://localhost:4444",
	proxyEnabled: false,
	proxyUrl: "https://registr.npmjs.org",
	auth: {
		users: {
			canPublish: true,
			canAccess: true,
		},
		register: true,
		public: false,
		remove: true,
	},
	ssl: {
		enabled: true,
		key: "/path/to/key",
		cert: "/path/to/cert"
	}
}, new MyAuthProvider());

myApplication.listen();
```

Implementing your AuthProvider in NodeJS is possible as well:
``` js
const ApNpm = require("ap-npm").default;
const AuthProvider = require("ap-npm").AuthProvider;

class MyAuthProvider extends AuthProvider {
	userLogin(username, password, email) {
		throw "Method not implemented.";
	}
	userAdd(username, password, email) {
		throw "Method not implemented.";
	}
	userRemove(username, password) {
		throw "Method not implemented.";
	}
	userLogout(token) {
		throw "Method not implemented.";
	}
	verifyToken(token) {
		throw "Method not implemented.";
	}
}

const myApplication = new ApNpm ({
	workDir: "/ap-npm",
	storage: {
		directory: "storage",
	},
	port: 4444,
	hostname: "https://localhost:4444",
	proxyEnabled: false,
	proxyUrl: "https://registr.npmjs.org",
	auth: {
		users: {
			canPublish: true,
			canAccess: true,
		},
		register: true,
		public: false,
		remove: true,
	},
	ssl: {
		enabled: true,
		key: "/path/to/key",
		cert: "/path/to/cert"
	}
}, );

myApplication.listen();

```

## Dependencies
ap-npm has been tested with:
- npm: 3.10 or higher
- node: 6.10 or higher


### [ap-npm on Docker Hub](https://hub.docker.com/r/meirbon/ap-npm/)
### [Info on using ap-npm](https://github.com/genkgo/ap-npm/wiki)
- [Usage](https://github.com/genkgo/ap-npm/wiki/Usage)
- [Setting up Docker](https://github.com/genkgo/ap-npm/wiki/Using-Docker)
- [Setting up authentication](https://github.com/genkgo/ap-npm/wiki/Authentication)
- [Setting up ssl](https://github.com/genkgo/ap-npm/wiki/Using-SSL)
