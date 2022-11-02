import { Router } from "express";

const router: Router = Router();

router.get('/client/', (_req, _res) => {
  _res.send("Client");
});

export default router;
