import 'dotenv/config';
import {get} from 'env-var'

export const envs = {
   PORT: get('PORT').required().asPortNumber(),
   cloud_name: get('CLOUD_NAME').required().asString(),
   cloud_api_key: get('CLOUD_API_KEY').required().asString(),
   cloud_api_secret: get('CLOUD_APY_SECRET').required().asString(),
}