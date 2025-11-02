const { loginService } = require('../services/authService');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const token = await loginService(email, password);
    res.status(200).json({ token });
  } catch (err) {
    const status = err.status || 401;
    res.status(status).json({ error: err.message });
  }
}

module.exports = { login };
