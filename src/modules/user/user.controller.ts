import { IFile } from './../../Common/types/multer.types';
import { StorageApproachEnum } from './../../Common/enum/multer.enum';
import { localFileUpload, fileValidation } from './../../Common/utils/multer/local.multer';
import { uploadMiddleware } from './../../middleware/multer.middleware';
import { getIssuer } from './../../Common/utils/issuer';
import { userService } from './user.service';
import { tokenTypeEnum } from "./../../Common/enum/security.enum";
import { responseFormatter } from "./../../middleware/response.middleware";
import { authentication } from "./../../middleware/authentication.middleware";
import { NextFunction, Request, Response, Router } from "express";
import { IResponse } from '../../Common/interface/response.interface.js';

const router = Router({ strict: true, caseSensitive: true });

router.get(
  "/",
  authentication,
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    return { data: req.user };
  }),
);
router.patch(
  "/profile-image",
  uploadMiddleware({
    multerMiddleware:localFileUpload({storageApproach:StorageApproachEnum.MEMORY}).single('attachment'),
    validation:fileValidation.image,
    customPath:'User'
  }),
  authentication,
  responseFormatter(async (req: Request, res: Response, next: NextFunction):Promise<IResponse<Record<string, string>>> => {
    const key = await userService.profileImage(req.file as IFile , req.user)
    return { data:{key} };
  }),
);


router.post(
  "/rotate-token",
  authentication(tokenTypeEnum.REFRESH),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await userService.rotateToken(
      req.payload,
      req.user,
      getIssuer(req)
    );
    return  data;
  }),
);
router.post(
  "/logout",
  authentication(),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const data = await userService.logout(req.payload, req.user, req.body);

    return  data;
  }),
);


export default router;
