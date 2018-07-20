import Route from "./route";
import { Request, Response } from "express";
import Filesystem from "../storage/filesystem";

export default class Search extends Route {
  private storage: Filesystem;

  constructor(storage: Filesystem) {
    super();
    this.storage = storage;
  }

  /**
   * Very simple implementation of a search route
   * Should not be used extensively, it's not very fast...
   * @param {e.Request} req
   * @param {e.Response} res
   * @returns {Promise<void>}
   */
  public async process(req: Request, res: Response): Promise<void> {
    const query = req.query.text;
    const size = req.query.size;

    const listing = await this.storage.getPackageListing();
    const objects: Array<IPackageSearchResult> = [];

    for (const [k, v] of listing) {
      if (objects.length >= size) break;
      if (k.startsWith("@")) {
        for (const scopedK of Object.keys(v)) {
          if (objects.length >= size) break;
          if (scopedK.indexOf(query) <= -1) {
            continue;
          }
          const pkgJson = await this.storage.getPackageJson({
            name: scopedK,
            scope: k
          });

          objects.push({
            "package": {
              name: scopedK,
              scope: k,
              author: pkgJson.author,
              version: pkgJson["dist-tags"]["latest"],
              description: pkgJson.description,
              keyword: pkgJson.keywords ? pkgJson.keywords : []
            },
            score: {},
            searchScore: 1
          });
        }
      } else {
        if (k.indexOf(query) <= -1) {
          continue;
        }
        const pkgJson = await this.storage.getPackageJson({
          name: k
        });

        objects.push({
          "package": {
            name: k,
            scope: "unscoped",
            version: pkgJson["dist-tags"]["latest"],
            description: pkgJson.description,
            keyword: pkgJson.keyword ? pkgJson.keywords : []
          },
          score: {},
          searchScore: 1
        });
      }
    }

    res.status(200).send({ objects });
  }
}

interface IPackageSearchResult {
  "package": {
    name: string;
    scope: string;
    version: string;
    description: string;
    keyword: Array<string>;
    date?: string;
    links?: {
      npm?: string;
      homepage?: string;
      repository?: string;
      bugs?: string;
    };
    author?: any;
    publisher?: {
      username?: string;
      email?: string;
    };
    maintainers?: Array<object>;
  };
  score: {
    final?: number;
    detail?: {
      quality: number;
      popularity: number;
      maintenance: number;
    }
  };
  searchScore: number;
}