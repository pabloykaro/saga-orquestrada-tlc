import express, { Request, Response } from "express";

export interface HttpServer {
  createRoute(url: string, method: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressHttpServer implements HttpServer {
  private app: any;
  constructor() {
    this.app = express();
    this.app.use(express.json());
  }
  createRoute(url: string, method: string, callback: Function): void {
    this.app[method](
      url,
      async function (request: Request, response: Response) {
        try {
          const output = await callback(request.params, request.body);
          response.json(output);
        } catch (err: any) {
          console.log(`ExpressHttpServer:createRoute`, err);
          response.status(422).json({ message: err.message });
        }
      }
    );
  }
  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Listening at`, port);
    });
  }
}
