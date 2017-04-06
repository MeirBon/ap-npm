export default class {

  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  handle (request, response) {
    let packageName = request.get('name');
    try {
      let packageExists = this.localStorage.findPackage(packageName, response);
      if (packageExists) {
        this.localStorage.removePackage(packageName, response);
      }
    } catch (e) {
      throw new Error('Cannot find package ' + packageName);
    }
  }
}
