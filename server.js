const express = require('express');
const app = express();

app.get('/api/secrets', (req, res) => {
  const clientSecret = process.env.CLIENT_SECRET;
  // You can add more environment variables or sensitive data as needed

  res.json({ clientSecret });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
