import { EmailSubjectEnum } from "../../enum/email.enum.js";


export const templates={
    [EmailSubjectEnum.CONFIRM_EMAIL]:(data:any)=>{
          return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
  
  <!-- Outer container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main email card -->
        <table width="480" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #4a1c2b; border-radius: 4px; overflow: hidden;">
          
          <!-- Header: Logo + View In Website -->
          <tr>
            <td style="padding: 20px 24px 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <!-- Logo -->
                    <span style="font-size: 20px; font-weight: bold; color: #1a1a1a; letter-spacing: -0.5px;">
                      <span style="display: inline-block; width: 22px; height: 22px; background-color: #1a1a1a; color: #ffffff; border-radius: 50%; text-align: center; line-height: 22px; font-size: 13px; margin-right: 6px;">L</span>INK-iT
                    </span>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <a href="#" style="color: #1a73e8; font-size: 13px; text-decoration: none;">View In Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Maroon banner with envelope icon -->
          <tr>
            <td style="background-color: #5c1a2e; text-align: center; padding: 28px 20px;">
              <div style="font-size: 42px; color: #ffffff; line-height: 1;">✉</div>
            </td>
          </tr>

          <!-- Dynamic Title -->
          <tr>
            <td style="background-color: #ffffff; text-align: center; padding: 32px 20px 28px 20px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 500; color: #5c1a2e; letter-spacing: 0.5px;">
                ${data.title}
              </h1>
            </td>
          </tr>

          <!-- Dynamic Code bar -->
          <tr>
            <td style="background-color: #5c1a2e; text-align: center; padding: 16px 20px;">
              <span style="color: #ffffff; font-size: 18px; font-weight: 500; letter-spacing: 1px;">
                ${data.code}
              </span>
            </td>
          </tr>

          <!-- Stay in touch + Social icons -->
          <tr>
            <td style="background-color: #ffffff; text-align: center; padding: 36px 20px 28px 20px;">
              <p style="margin: 0 0 18px 0; font-size: 15px; color: #333333;">
                Stay in touch
              </p>
              
              <!-- Social icons -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <!-- Facebook -->
                  <td style="padding: 0 8px;">
                    <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #3b5998; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                      <span style="color: #ffffff; font-size: 16px; font-weight: bold;">f</span>
                    </a>
                  </td>
                  <!-- Instagram -->
                  <td style="padding: 0 8px;">
                    <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #e1306c; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                      <span style="color: #ffffff; font-size: 14px;">📷</span>
                    </a>
                  </td>
                  <!-- Twitter -->
                  <td style="padding: 0 8px;">
                    <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                      <span style="color: #ffffff; font-size: 16px; font-weight: bold;">𝕏</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
    },
    [EmailSubjectEnum.FORGET_PASSWORD]:(data:any)=>{
          return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
  
  <!-- Outer container -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main email card -->
        <table width="480" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #4a1c2b; border-radius: 4px; overflow: hidden;">
          
          <!-- Header: Logo + View In Website -->
          <tr>
            <td style="padding: 20px 24px 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <!-- Logo -->
                    <span style="font-size: 20px; font-weight: bold; color: #1a1a1a; letter-spacing: -0.5px;">
                      <span style="display: inline-block; width: 22px; height: 22px; background-color: #1a1a1a; color: #ffffff; border-radius: 50%; text-align: center; line-height: 22px; font-size: 13px; margin-right: 6px;">L</span>INK-iT
                    </span>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <a href="#" style="color: #1a73e8; font-size: 13px; text-decoration: none;">View In Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Maroon banner with envelope icon -->
          <tr>
            <td style="background-color: #5c1a2e; text-align: center; padding: 28px 20px;">
              <div style="font-size: 42px; color: #ffffff; line-height: 1;">✉</div>
            </td>
          </tr>

          <!-- Dynamic Title -->
          <tr>
            <td style="background-color: #ffffff; text-align: center; padding: 32px 20px 28px 20px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 500; color: #5c1a2e; letter-spacing: 0.5px;">
                ${data.title}
              </h1>
            </td>
          </tr>

          <!-- Dynamic Code bar -->
          <tr>
            <td style="background-color: #5c1a2e; text-align: center; padding: 16px 20px;">
              <span style="color: #ffffff; font-size: 18px; font-weight: 500; letter-spacing: 1px;">
                ${data.code}
              </span>
            </td>
          </tr>

          <!-- Stay in touch + Social icons -->
          <tr>
            <td style="background-color: #ffffff; text-align: center; padding: 36px 20px 28px 20px;">
              <p style="margin: 0 0 18px 0; font-size: 15px; color: #333333;">
                Stay in touch
              </p>
              
              <!-- Social icons -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <!-- Facebook -->
                  <td style="padding: 0 8px;">
                    <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #3b5998; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                      <span style="color: #ffffff; font-size: 16px; font-weight: bold;">f</span>
                    </a>
                  </td>
                  <!-- Instagram -->
                  <td style="padding: 0 8px;">
                    <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #e1306c; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                      <span style="color: #ffffff; font-size: 14px;">📷</span>
                    </a>
                  </td>
                  <!-- Twitter -->
                  <td style="padding: 0 8px;">
                    <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                      <span style="color: #ffffff; font-size: 16px; font-weight: bold;">𝕏</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
    },
}





export const verifyEmailTemplate =<T=any> (data :T&{subject:EmailSubjectEnum}) => {
    return templates[data.subject](data)
};