export const generatePassword = (longitud = 12) => {
   const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]=";
   let password = "";

   for (let i = 0; i < longitud; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      password += caracteres[indiceAleatorio];
   }
   return password;
}
