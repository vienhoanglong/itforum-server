export const templateVerificationEmail = (content: string, otp: string) => {
  return `<!DOCTYPE html>
    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    </head>
    <body
      style="text-size-adjust: none; background-color: #d9dffa; margin: 0; padding: 0;">
      <div style="color:#506bec;font-family:Helvetica Neue, Helvetica, Arial, sans-serif; text-align:left; margin: auto; width: 400px;">
        <span style="text-align: center; font-size: 40px; font-weight: 800;">Mã xác thực</span>
        <div style="color: #0c0c0c; padding:10px 0px;">
          <span>Xin chào!</p>
          <p>Mã xác minh bạn cần dùng để truy cập vào Tài khoản:</p>
          <div style="text-align: center;">
            <span style="
            color: #506bec;
            font-size: 40px;
            font-weight: 900;">${otp}</span>
          </div>
          <p>${content}</p>
        </div>
      </div>
    </body>
    </html>`;
};

export default function generateOTP(limit = 6): string {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export const getCommaSeparatedNames = (
  users: {
    fullName: string;
    username: string;
    email: string;
  }[],
  maxNames = 3,
): string => {
  const names: string[] = users.map((user) => {
    const lastName = user.fullName.split(' ').pop() || ''; // In case fullName is empty
    return lastName;
  });

  if (names.length <= maxNames) {
    return names.join(',');
  } else {
    const truncatedNames = names.slice(0, maxNames);
    return `${truncatedNames.join(',')},...`;
  }
};
