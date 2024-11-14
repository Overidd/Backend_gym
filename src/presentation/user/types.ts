

export type ICreateUser = {
   email: string,
   password: string,
   first_name: string,
   last_name: string,
   is_active: boolean,
   imagen?: string,

   is_user_temp?: boolean,
   is_confirmed: boolean,
   is_google_account: boolean,
}

export type IUpdateUser = {
   email?: string,
   password?: string,
   first_name?: string,
   last_name?: string,
   is_active: boolean,
   imagen?: string,

   is_user_temp?: boolean,
   is_confirmed?: boolean,
   is_google_account?: boolean,
}


export type IResUserTemp = {
   id: number,
   email: string,
   first_name: string,
   last_name: string,
   is_active: boolean,
   is_confirmed: boolean,
   is_google_account: boolean,
   imagen: string | null,
   created_at: Date,
   updated_at: Date,
   is_user_temp: boolean,
   password?: string
}

export type IResUser = {
   id: number,
   email: string,
   first_name: string,
   last_name: string,
   is_active: boolean,
   is_confirmed: boolean,
   is_google_account: boolean,
   imagen: string | null,
   created_at: Date,
   updated_at: Date,
   is_user_temp: boolean,
   password?: string
}