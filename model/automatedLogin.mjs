/**
 * 自动登录
 */
export default async function automatedLogin(page, email) {
  const pwdLoginNav = await page.waitForSelector(
    '#app > div.login-container > div > div > nav > div:nth-child(3)'
  );
  pwdLoginNav.click();

  // 登录操作
  const loginInput = await page.waitForSelector(
    '#app > div.login-container > div > div > div.password-container > form > div.main > div.phone-wrapper > div.phone-input > input[type=text]'
  );
  await loginInput.type(email);

  const pwdInput = await page.waitForSelector(
    '#app > div.login-container > div > div > div.password-container > form > div.main > div.password-wrapper > div.password-input > input[type=password]'
  );
  await pwdInput.type(process.env.ACCOUNT_PASSWORD);

  const loginButton = await page.$(
    '#app > div.login-container > div > div > div.password-container > form > div.footer > button'
  );
  await loginButton.click();
}
