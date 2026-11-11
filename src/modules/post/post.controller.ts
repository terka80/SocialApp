import { IResponse } from "../../Common/interface/response.interface";
import { authentication } from "../../middleware/authentication.middleware";
import { responseFormatter } from "../../middleware/response.middleware";
import { validation } from "../../middleware/validation.middleware";
import { NextFunction, Request, Response, Router } from "express";
import { commentContent } from "../comment/comment.validation";
import { postService } from "./post.service";
import { postContent } from "./post.validation";

const router = Router({ strict: true, caseSensitive: true });

router.post(
  "/",
  authentication(),
  validation(postContent),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await postService.create(req.validate.body.content, req.user);
    return { status: 201, data };
  }),
);

router.get(
  "/",
  authentication(),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await postService.findMine(req.user);
    return { data };
  }),
);

router.post(
  "/:postId/comments",
  authentication(),
  validation(commentContent),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await postService.createComment(
      req.params.postId as string,
      req.validate.body.content,
      req.user,
    );
    return { status: 201, data };
  }),
);

router.get(
  "/:postId/comments",
  authentication(),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await postService.findComments(req.params.postId as string);
    return { data };
  }),
);

router.get(
  "/:postId",
  authentication(),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await postService.findById(req.params.postId as string);
    return { data };
  }),
);

router.patch(
  "/:postId",
  authentication(),
  validation(postContent),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await postService.update(
      req.params.postId as string,
      req.validate.body.content,
      req.user,
    );
    return { data };
  }),
);

router.delete(
  "/:postId",
  authentication(),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    await postService.delete(req.params.postId as string, req.user);
    return { data: { deleted: true } };
  }),
);

export default router;
