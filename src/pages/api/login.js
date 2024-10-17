import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import session from "../../app/lib/session"; // Import the session middleware

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await session(req, res); // Call session middleware to initiate session

  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Store user data in the session
    req.session.userId = user.userID;
    console.log(req.session.userId);
    req.session.firstName = user.firstName;
    req.session.secondName = user.secondName;
    req.session.propertyId = user.propertyID;

    return res.status(200).json({ message: "Login successful." });
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}

// Disconnect Prisma client on server termination
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
