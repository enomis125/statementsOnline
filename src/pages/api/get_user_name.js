import session from "../../app/lib/session";

export default async function handler(req, res) {
  await session(req, res); // Initialize session middleware
  console.log(req.session);
  // Check if the session has user data
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Return the first name from the session
  return res.status(200).json({
    firstName: req.session.firstName,
    secondName: req.session.secondName,
    propertyID: req.session.propertyId,
  });
}
