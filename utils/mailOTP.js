import nodemailer from "nodemailer";



export const sendMailOtp = async (mail,otp) => {
    let testAccount = await nodemailer.createTestAccount();

    let transpoter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
      //   secure: false, //IF PORT IS 465 SO TRUE OTHERWISE FALSE
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      
    console.log(mail);
    const subject = "OTP FROM THE THE DRY CLEAN";
    const message ="Welcome to DryClean,This Message Send From The DryClean.";
    var mailOptions = {
      from: process.env.EMAIL_FROM,
      to: mail,
      subject: subject,
      // text: message,
      html:`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Dry clean</a>
        </div>
        <p style="font-size:1.1em;margin-bottom:2px">Hi,</p>
        <p>Thank you for choosing Dryclean. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <p style="font-size:0.9em;">Regards,<br />Dryclean</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Your Dryclean</p>
          
        </div>
      </div>
    </div>`
        
      
    };
    console.log(mailOptions.from,mailOptions.to);
    transpoter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log("👍");
        }
    });
    console.log(`Email Send To ${mail}`);
 
};

