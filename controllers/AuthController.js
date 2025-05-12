import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";
export const checkUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ msg: "email is required", status: false })
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.json({ msg: "user not found", status: false })

        } else {
            return res.json({ msg: "user found", status: true, data: user })

        }




    } catch (err) {
        next(err);
    }
};

export const onBoardUser = async (req, res, next) => {
    try {
        const { email, name, about, image: profilePicture } = req.body;
        if (!email || !name || !profilePicture) {
            return res.send("Email ,Image,name is required")
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.create({
            data: { email, name, about, profilePicture },

        });
        return res.json({ msg: "Success", status: true, user })
    }
    catch (err) {
        next(err);

    }
}

export const getAllUser = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance();
        const users = await prisma.user.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
                about: true,
            },


        });


        const usersGroupedByInitialLetter = {};

        users.forEach((user) => {
            const initialLetter = user.name.charAt(0).toUpperCase();
            if (!usersGroupedByInitialLetter[initialLetter]) {
                usersGroupedByInitialLetter[initialLetter] = [];
            }
            usersGroupedByInitialLetter[initialLetter].push(user);
        });
        return res.status(200).send({ users: usersGroupedByInitialLetter })
    } catch (err) {
        next(err);
    }
};

export const generateToken =  (req, res, next) => {
    try {
        const appId = parseInt(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_ID;
        const userId = req.params.userId;
        const effectiveTime = 3600;
        const payload = "";


        if (appId && serverSecret && userId) {
            const token = generateToken04(
                appId,
                userId,
                serverSecret,
                effectiveTime,
                payload
            );
            res.status(200).json({ token });
        }

        return res.status(400).send("user id ,appid,serversecret is req.");
    } catch (err) {
        next(err);
    }
};
