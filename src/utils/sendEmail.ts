import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM || "",
      subject,
      text,
    });
  } catch (error) {
    console.error("SendGrid email error:", error);
  }
};
