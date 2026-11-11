import { BadRequestException } from './../exception/domain.exception';
import { randomUUID } from 'node:crypto';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_ACCESS_SECRET_KEY, APPLICATION_NAME, AWS_BUCKET_NAME } from './../../config';
import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class CloudService{

    private cloudClient:S3Client
    constructor(){
        this.cloudClient= new S3Client({
            region:AWS_REGION,
            credentials:{
                accessKeyId:AWS_ACCESS_KEY_ID,
                secretAccessKey:AWS_ACCESS_SECRET_KEY
            }
        })
    }
    async uploadAsset({ Bucket=AWS_BUCKET_NAME ,ACL=ObjectCannedACL.private,file , folder='general',}:{file:Express.Multer.File , folder?:string ,Bucket?:string ,ACL?:ObjectCannedACL}):Promise<string>{
        const Key= `${APPLICATION_NAME}/${folder}/${randomUUID()}_${file.originalname}`
        const command = new PutObjectCommand({
            Bucket, 
            Key,
            ACL,
            Body:file.buffer

        })
        await this.cloudClient.send(command)
        if (!command.input.Key) {
            throw new BadRequestException('fail to upload this asset ')
        }
        return command.input.Key
    }
}


export const cloudService= new CloudService()