import { authentication } from "../../middleware/authentication.middleware";
import { responseFormatter } from "../../middleware/response.middleware";
import { validation } from "../../middleware/validation.middleware";
import { NextFunction, Request, Response, Router } from "express";
import { commentService } from "./comment.service";
import { commentContent } from "./comment.validation";

const router = Router({ strict: true, caseSensitive: true });

router.get(
  "/:commentId",
  authentication(),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await commentService.findById(req.params.commentId as string);
    return { data };
  }),
);

router.patch(
  "/:commentId",
  authentication(),
  validation(commentContent),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await commentService.update(
      req.params.commentId as string,
      req.validate.body.content,
      req.user,
    );
    return { data };
  }),
);

router.delete(
  "/:commentId",
  authentication(),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    await commentService.delete(req.params.commentId as string, req.user);
    return { data: { deleted: true } };
  }),
);

export default router;
