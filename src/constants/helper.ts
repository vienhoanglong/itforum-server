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

export const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // str = str.replace(
  //   /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
  //   ' ',
  // );
  return str;
};
export function isImageFile(extension: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  return imageExtensions.includes(extension.toLowerCase());
}
