import { HydratedDocument } from "mongoose";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { IUser } from "@/lib/utils/types/fniDataTypes";
import User from "@/lib/Models/user";
import { Databases, FromEmails } from "@/lib/utils/types/enums";
import sendEmail from "@/lib/helpers/sendEmail";
import * as crypto from "crypto";
import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage('./scratch');

interface RequestContext {}
const router = createEdgeRouter<NextRequest, RequestContext>();
const key = crypto
  .createHash("sha512")
  .update("secretKey")
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update("secretIV")
  .digest("hex")
  .substring(0, 16);

router.post(async (req) => {
  const { userId , otp, password,confirm} = await req?.json();
  console.log(userId,otp,password);
  try {
    if (!userId) throw new Error("userId is required");
   

    await connectDB(Databases.FNI);
    const result: HydratedDocument<IUser> | null = await User.findOne({
      userId,
    });
   if(!otp && !password){
    if (!result) throw new Error("Incorrect user name");
    if (result?.status === "Inactive")
      throw new Error(
        "Your status is Inactive, please contact the admin to change your status!"
      );
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      localStorage.setItem('otp', OTP.toString())
      // localStorage.setItem('otpCreatedDataAt',new Date().toString())
  
      const html = `<!doctypehtml><html lang=en xmlns:o=urn:schemas-microsoft-com:office:office xmlns:v=urn:schemas-microsoft-com:vml><title></title><meta content="text/html; charset=utf-8"http-equiv=Content-Type><meta content="width=device-width,initial-scale=1"name=viewport><!--[if mso]><xml><o:officedocumentsettings><o:pixelsperinch>96</o:pixelsperinch><o:allowpng></o:officedocumentsettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]--><style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}sub,sup{line-height:0;font-size:75%}@media (max-width:520px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}</style><!--[if mso ]><style>sub,sup{font-size:100%!important}sup{mso-text-raise:10%}sub{mso-text-raise:-10%}</style><![endif]--><body class=body style=background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none><table border=0 cellpadding=0 cellspacing=0 class=nl-container role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100%><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row row-1"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100% align=center><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%><table border=0 cellpadding=10 cellspacing=0 class="block-1 heading_block"role=presentation style=mso-table-lspace:0;mso-table-rspace:0 width=100%><tr><td class=pad><h3 style="margin:0;color:#7747ff;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:left;margin-top:0;margin-bottom:0;mso-line-height-alt:28.799999999999997px"><span class=tinyMce-placeholder style=word-break:break-word>Verification code</span></h3></table></table></table><table border=0 cellpadding=0 cellspacing=0 class="row row-2"role=presentation style=mso-table-lspace:0;mso-table-rspace:0;background-color:#fff width=100% align=center><tr><td><table border=0 cellpadding=0 cellspacing=0 class="row-content stack"role=presentation style="mso-table-lspace:0;mso-table-rspace:0;color:#000;background-color:#fff;width:500px;margin:0 auto"width=500 align=center><tr><td class="column column-1"style=mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0 width=100%>
      Please use the verification code is <strong style="font-size: 100%">${OTP}</strong>.If you didn’t request this, you can ignore this email.
      </table></table></table>`;
      sendEmail({
        from: FromEmails.DO_NOT_REPLY,
        recipients: result?.email,
        subject: `Verification code`,
        html,
      });

    return NextResponse.json(
      {
        success: true,
        message: "Otp send successfully on email",
      },
      { status: 200 }
    );
   }
   else{

    if (!otp) throw new Error("Otp is required");
    if (password  !== confirm) throw new Error("Passwords don't match");
       const updatedPass =  decryptData(password)
      //  if (!isPasswordStrong(updatedPass)) throw new Error("Password is too weak.");

    if(otp.toString() !=  localStorage.getItem('otp')) throw new Error ("Please enter correct otp")
   const updatedUser =  await User.updateOne({userId: userId}, {$set:{password: password}})
    return NextResponse.json(
      {
        success: true,
        message: "Password Changed",
      },
      { status: 200 }
    );
   }

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
        data: null,
      },
      { status: error?.statusCode || 500 }
    );
  }
});
function isPasswordStrong(password:string) {
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    return false;
  }
  return true;
}
function decryptData(encryptedData: any) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  );
}
export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
