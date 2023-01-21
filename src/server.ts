import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from "./routes";

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(morgan('combined'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

app.use(routes);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
