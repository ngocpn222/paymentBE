// middleware/authorize.js

const authorize = (roles = []) => {
  // Nếu chỉ truyền 1 role dạng string thì chuyển thành mảng
  if (typeof roles === "string") {
    roles = [roles];
  }

  // Trả về middleware để kiểm tra quyền
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not authorized" });
    }

    next(); // Cho phép đi tiếp nếu có quyền
  };
};

module.exports = authorize;
