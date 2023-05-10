//* Middleware to check for role based authorization on admin module
const checkAdminReadWrite = (req, res, next) =>{
  console.log("Checking admin access");
  const isAdmin = req.body.adminRoles[1] === "Admin";
  const hasReadWrite = req.body.adminRoles[0] === "readwrite";
  if (isAdmin && hasReadWrite) {
    console.log("Admin access approved !");
    // User has the necessary permissions, so allow them to continue
    next();
  } else {
    // User does not have the necessary permissions, so return an error response
    console.log("Only admins can modify permissions and data");
    res.status(403).json({ status: "error", error: "Forbidden" });
  }
}

module.exports = checkAdminReadWrite