const clientId = process.env.CLIENT_ID;
const redirectUri = process.env.REDIRECT_URI;

const loginButton = document.getElementById('discordLogin');
const avatarImg = document.querySelector('.login-inner img');

loginButton.addEventListener('click', () => {
  const discordSdk = new Discord.Client({ clientId });
  discordSdk.login({ redirectUri, scope: 'identify' }).catch(console.error);
});

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
  const data = {
    client_id: clientId,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    scope: 'identify'
  };

  const tokenUrl = 'https://discord.com/api/oauth2/token';
  fetch(tokenUrl, {
    method: 'POST',
    body: new URLSearchParams(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => response.json())
  .then(tokenData => {
    const accessToken = tokenData.access_token;
    const profileUrl = 'https://discord.com/api/v10/users/@me';

    fetch(profileUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then(profileData => {
      avatarImg.src = `https://cdn.discordapp.com/avatars/${profileData.id}/${profileData.avatar}.png`;
      avatarImg.alt = 'User avatar';
    });
  })
  .catch(console.error);
}
