import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogRouter from "./blog";
import educationRouter from "./education";
import writerRouter from "./writer";
import aiRouter from "./ai";
import marketRouter from "./market";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogRouter);
router.use(educationRouter);
router.use(writerRouter);
router.use(aiRouter);
router.use(marketRouter);

export default router;
