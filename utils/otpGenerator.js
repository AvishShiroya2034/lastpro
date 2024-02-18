import otpGenerator from 'otp-generator';

export const otpGenerate = ()=>{
    const OTP = otpGenerator.generate(4,{
        digits:true,
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false
    })
    return OTP;
}