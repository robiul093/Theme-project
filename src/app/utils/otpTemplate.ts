export const otpEmailTemplate = (otp: string, title = "Verify Your Email") => {
    const otpDigits = otp.split("");

    const otpBoxes = otpDigits
        .map(
            (digit) => `
      <td align="center" valign="middle"
        style="
          background:#f3f4f6;
          border-radius:10px;
          width:50px;
          height:50px;
          font-size:22px;
          font-weight:700;
          color:#111827;
          text-align:center;
          border:1px solid #e5e7eb;
        ">
        ${digit}
      </td>
      <td width="8"></td>
    `
        )
        .join("");

    return `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background:#f9fafb; padding:40px 0;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">

          <table width="520" cellpadding="0" cellspacing="0"
            style="
              background:#ffffff;
              border-radius:16px;
              padding:40px;
              box-shadow:0 10px 25px rgba(0,0,0,0.08);
            ">

            <tr>
              <td align="center" style="font-size:26px; font-weight:700; color:#111827;">
                ${title}
              </td>
            </tr>

            <tr>
              <td height="12"></td>
            </tr>

            <tr>
              <td align="center" style="color:#6b7280; font-size:15px;">
                Use the verification code below to continue.
              </td>
            </tr>

            <tr>
              <td height="30"></td>
            </tr>

            <tr>
              <td align="center">
                <table cellspacing="0" cellpadding="0">
                  <tr>
                    ${otpBoxes}
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td height="30"></td>
            </tr>

            <tr>
              <td align="center" style="color:#9ca3af; font-size:13px;">
                This OTP will expire in 10 minutes.
              </td>
            </tr>

            <tr>
              <td height="20"></td>
            </tr>

            <tr>
              <td align="center" style="color:#d1d5db; font-size:12px;">
                If you didn't request this, please ignore this email.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `;
};