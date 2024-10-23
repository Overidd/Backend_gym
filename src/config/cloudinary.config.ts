import { v2 as cloudinary } from 'cloudinary'
import { envs } from '.'

 cloudinary.config({
   cloud_name: envs.cloud_name,
   api_key: envs.cloud_api_key,
   api_secret: envs.cloud_api_secret,
})

export {
   cloudinary,
}
