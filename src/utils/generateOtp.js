function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = generateOTP;


//Math.random()  0 aur 1 ke beech random decimal number deta hai.  Example: 0.32847

//Math.random() * 900000  Ab ye number 0 se 899999 ke beech aa jayega. Example: 0.32847 × 900000 = 295,623

//100000 + Math.random() * 900000  Isse ensure hota hai ki OTP kabhi 6-digit se kam na ho
//  (5-digit ki problem avoid ho jati hai). Range ban jati hai: 100000 → 999999

//Math.floor(...) Decimal hata deta hai, integer banata hai.

