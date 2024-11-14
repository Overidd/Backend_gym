import { envs } from "../config";
import { InternalServerError } from "../utils";

export type IPaylodPlan = {
   product_id: string;
   interval_month: number
   value: string
}

export type IPaylodService = {
   name: string
   category: string
   type: string,
   description?: string,
}

export type IPaylodServiceUpdate = {
   name?: string
   description?: string
}

export type IPayloadSubscription = {
   planId: string,
   fistName: string,
   lastName: string,
   email: string
}

export interface IResCheckSubscripton {
   id: string;
   plan_id: string;
   start_time: Date;
   quantity: string;
   shipping_amount: ShippingAmount;
   subscriber: Subscriber;
   billing_info: BillingInfo;
   create_time: Date;
   update_time: Date;
   links: Link[];
   status: string;
   status_update_time: Date;
}
type BillingInfo = {
   outstanding_balance: ShippingAmount;
   cycle_executions: CycleExecution[];
   last_payment: LastPayment;
   next_billing_time: Date;
   failed_payments_count: number;
}
type CycleExecution = {
   tenure_type: string;
   sequence: number;
   cycles_completed: number;
   cycles_remaining: number;
   total_cycles: number;
}
type LastPayment = {
   amount: ShippingAmount;
   time: Date;
}
type ShippingAmount = {
   currency_code: string;
   value: string;
}
type Link = {
   href: string;
   rel: string;
   method: string;
}
type Subscriber = {
   shipping_address: ShippingAddress;
   name: SubscriberName;
   email_address: string;
   payer_id: string;
}
type SubscriberName = {
   given_name: string;
   surname: string;
}
type ShippingAddress = {
   name: ShippingAddressName;
   address: Address;
}
type Address = {
   address_line_1: string;
   address_line_2: string;
   admin_area_2: string;
   admin_area_1: string;
   postal_code: string;
   country_code: string;
}
type ShippingAddressName = {
   full_name: string;
}

export class Paypal {
   constructor() { }

   async getAccessToken(): Promise<string> {
      try {
         const auth = Buffer.from(
            envs.paypal_client_id + ':' +
            envs.paypal_client_secret
         ).toString('base64');

         const response = await fetch(`${envs.paypal_api_url}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
               'Authorization': `Basic ${auth}`,
               'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
         });

         const data = await response.json();

         return data.access_token;

      } catch (error) {
         throw new Error();
      }
   }

   async createPlan(access_token: string, data: IPaylodPlan): Promise<string | null> {
      try {
         const payload = {
            product_id: data.product_id,
            name: "Plan mensual del gimnasio",
            description: "Plan de facturación mensual",
            billing_cycles: [
               {
                  frequency: {
                     interval_unit: "MONTH",
                     interval_count: data.interval_month,
                  },
                  tenure_type: "REGULAR",
                  sequence: 1, // 1 = Primer ciclo de facturación
                  total_cycles: 0, // 0 = ilimitado
                  
                  pricing_scheme: {
                     fixed_price: {
                        value: data.value,
                        currency_code: "USD"
                     }
                  }
               }
            ],
            payment_preferences: {
               auto_bill_outstanding: true,
               setup_fee: {
                  value: data.value,
                  currency_code: "USD"
               },
               setup_fee_failure_action: "CANCEL",
               payment_failure_threshold: 2
            },
         }
         const response = await fetch(`${envs.paypal_api_url}/v1/billing/plans`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${access_token}`,
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
         });

         const dataJson = await response.json();

         if (response.status !== 201) {
            return null;
         }
         return dataJson.id;
      } catch (error) {
         throw new InternalServerError(
            ['No es posible continuar con el pago', 'Error inesperado del servidor']
         )
      }
   };

   async createService(access_token: string, data: IPaylodService): Promise<string> {
      try {
         const payload = {
            name: data.name,
            description: data.description,
            type: data.type,
            category: data.category
         }
         const response = await fetch(`${envs.paypal_api_url}/v1/catalogs/products`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${access_token}`,
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
         });

         const dataJson = await response.json();

         return dataJson.id;
      } catch (error) {
         console.log(error);
         throw new Error();
      }
   };

   async updateService(access_token: string, serviceId: string, data: IPaylodServiceUpdate): Promise<boolean> {
      try {
         let payload: object[] = []

         Array.from(Object.entries(data)).forEach(([key, value]) => {
            if (!value) return;

            payload.push({
               "op": "replace",
               "path": `/${key}`,
               "value": value,
            })
         })

         const response = await fetch(`${envs.paypal_api_url}/v1/catalogs/products/${serviceId}`, {
            method: 'PATCH',
            headers: {
               'Authorization': `Bearer ${access_token}`,
               'Content-Type': 'application/json',
               'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
         });

         if (response.status != 204) {
            return false
         }
         return true
      } catch (error) {
         return false
      }
   }
   
   async createSubscription(access_token: string, data: IPayloadSubscription): Promise<string | null> {
      try {
         const payload = {
            plan_id: data.planId,
            subscriber: {
               name: {
                  given_name: data.fistName,
                  surname: data.lastName,
               },
               email_address: data.email,
            },
            application_context: {
               brand_name: "Web gimnasio",
               locale: "es-ES",
               shipping_preference: "NO_SHIPPING",
               user_action: "SUBSCRIBE_NOW",
               return_url:
                  `${envs.server_url || "http://localhost:" + envs.PORT}/api/v1/subscription/success/${data.planId}`,
               cancel_url:
                  `${envs.server_url || "http://localhost:" + envs.PORT}/api/v1/subscription/cancel/${data.planId}`,
            }
         }
         const response = await fetch(`${envs.paypal_api_url}/v1/billing/subscriptions`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${access_token}`,
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
         })

         const dataJson = await response.json();

         if (response.status !== 201) {
            return null;
         }
         return dataJson.id
      } catch (error) {
         return null;
      }
   };

   async checkSubscription(accessToken: string, subscriptionId: string): Promise<IResCheckSubscripton | null> {
      try {
         const response = await fetch(`${envs.paypal_api_url}/v1/billing/subscriptions/${subscriptionId}`, {
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
         });

         const data = await response.json();
         if (response.status !== 200) {
            return null;
         }
         return data;
      } catch (error) {
         return null;
      }
   }
}

/**
   ACTIVE: La suscripción está activa, lo que implica que el pago inicial fue exitoso y que la suscripción está configurada para capturar pagos recurrentes.
   
   APPROVAL_PENDING: La suscripción está pendiente de aprobación por el cliente.
   
   SUSPENDED: La suscripción está suspendida, posiblemente debido a problemas con el pago.
   
   CANCELLED: La suscripción fue cancelada.
   
   EXPIRED: La suscripción expiró.
 */

