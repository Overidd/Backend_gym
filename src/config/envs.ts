import 'dotenv/config';
import {get} from 'env-var'

export const envs = {
   PORT: get('PORT').required().asPortNumber(),
   secret_token: get('SECRET_TOKEN').required().asString(), 
   cloud_name: get('CLOUD_NAME').required().asString(),
   cloud_api_key: get('CLOUD_API_KEY').required().asString(),
   cloud_api_secret: get('CLOUD_APY_SECRET').required().asString(),
   server_url: get('SERVER_URL').asString(),

   cloud_activate: get('CLOUD_ACTIVATE').default('false').asBool(),

   paypal_api_url: get('PAYPAL_API_URL').required().asString(),
   paypal_client_id: get('PAYPAL_CLIENT_ID').required().asString(),
   paypal_client_secret: get('PAYPAL_CLIENT_SECRET').required().asString(),
   paypal_mode: get('PAYPAL_MODE').default('sandbox').asString(),

   resend_api_key: get('RESEND_API_KEY').asString(),

   email_name: get('EMAIL_NAME').asString(),
   email_key: get('EMAIL_KEY').asString(),

}