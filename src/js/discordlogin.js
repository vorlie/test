const loginButton = document.getElementById('discordLogin');
const avatarImg = document.querySelector('.login-inner img');

loginButton.addEventListener('click', () => {
  fetch('/api/')
    .then(response => response.json())
    .then(data => {
      const clientId = "1130090992129806476";
      const redirectUri = 'https://materialdetta.vorlie.pl/api';

      const discordSdk = new Discord.Client({ clientId });
      discordSdk.login({ redirectUri, scope: 'identify' }).catch(console.error);
    })
    .catch(error => {
      console.error('Error retrieving secrets:', error);
    });
});

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
  const data = {
    code: code,
    redirect_uri: 'https://materialdetta.vorlie.pl/api',
    scope: 'identify'
  };

  fetch('/api/')
    .then(response => response.json())
    .then(secrets => {
      data.client_id = secrets.clientSecret;
      data.client_secret = secrets.clientSecret;

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
    })
    .catch(error => {
      console.error('Error retrieving secrets:', error);
    });
}
