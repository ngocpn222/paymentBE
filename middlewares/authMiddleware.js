const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Lấy token từ header dạng "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    // Xác thực token với secret từ .env
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // Gán thông tin user đã giải mã vào request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

module.exports = authenticateToken;
