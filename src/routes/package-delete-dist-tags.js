export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let packageName = httpRequest.params.package;
      let distTag = httpRequest.params.tag;

      this.storage.getPackageData({name: httpRequest.params.package})
        .catch((err) => reject(err))
        .then((packageJson) => {
        delete(packageJson['dist-tags'][distTag]);

        this.storage.updatePackageJson(packageName, packageJson).then((result) => {
          if (result === true) {
            httpResponse.status(200);
            httpResponse.send({
              ok: "dist-tags updated"
            });
            resolve();
          } else {
            reject("404, could not get dist-tags");
          }
        });
      });
    }).catch((err) => {
      httpResponse.send(err);
    });
  }
}