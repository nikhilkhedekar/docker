const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AsyncManager = require("../utils/asyncManager");
const TwoFactorError = require("../utils/twoFactorError");

const createJWT = ({ payload }) => {
    const JWT_SECRET = "RgUkXp2s5v8y/A?D(G+KbPeShVmYq3t6";
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
};

const cookieTokenResponse = (user, statusCode, res) => {
    const token = createJWT({ payload: { user } })

    const cookieOptions = {
        // expires: new Date(
        //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        // ),
        httpOnly: true,
    };
    // if (process.env.NODE_ENV === "production") {
    //     cookieOptions.secure = true;
    // }
    user.password = undefined;
    user.twoFactorAuthCode = undefined;

    res.status(statusCode).cookie("accessToken", token, cookieOptions).json({
        message: "success",
        token,
        data: {
            user,
        },
    });
};

const generateSpeakeasySecretCode = () => {
    const secretCode = speakeasy.generateSecret({
        // name: process.env.TWO_FACTOR_APP_NAME,
    });
    return {
        otpauthUrl: secretCode.otpauth_url,
        base32: secretCode.base32,
    };
};

const returnQRCode = (data, res) => {
    QRCode.toFileStream(res, data);
};

exports.registerUser = AsyncManager(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword,
    });

    cookieTokenResponse(newUser, 201, res);
});

exports.generate2FACode = async (req, res, next) => {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, "RgUkXp2s5v8y/A?D(G+KbPeShVmYq3t6");
    console.log(decoded);
    const { otpauthUrl, base32 } = generateSpeakeasySecretCode();
    const user = await User.findOneAndUpdate(
        { _id: decoded.user._id },
        { twoFactorAuthCode: base32 },
        { new: true, runValidators: true }
    );
    const resToken = speakeasy.totp({
        secret: base32,
        encoding: 'base32',
    });
    console.log({ user, resToken });
    // returnQRCode(otpauthUrl, res);   
    res.status(201).json({ user, token: resToken })
};

exports.verify2FACode = async (req, res, next) => {
    const { token } = req.body;
    const cookieToken = req.cookies.accessToken;
    const decoded = jwt.verify(cookieToken, "RgUkXp2s5v8y/A?D(G+KbPeShVmYq3t6");
    const user = await User.findById(decoded.user._id);

    console.log("user", user)
    const verified = speakeasy.totp.verify({
        secret: user.twoFactorAuthCode,
        encoding: "base32",
        token,
        window: 1,
    });

    if (verified) {
        await User.findOneAndUpdate(
            { _id: decoded.user._id },
            { twoFactorAuthEnabled: true },
            { new: true, runValidators: true }
        );
        cookieTokenResponse(user, 200, res);
    } else {
        res.json({
            verified: false,
        });
    }
};

exports.loginUser = AsyncManager(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new TwoFactorError("Please provide and email and password!", 400)
        );
    }

    const user = await User.findOne({ email }).select("+password");
    console.log("user", user);
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new TwoFactorError("Incorrect email or password", 401));
    }

    if (user.twoFactorAuthEnabled) {
        cookieTokenResponse(user, 200, res);
    } else {
        new Error("Sign In Failed");
    }
});

exports.logoutUser = AsyncManager(async (req, res, next) => {
    // res.cookie("accessToken", "loggedout", {
    //     expires: new Date(Date.now + 10 * 1000),
    //     httpOnly: true,
    // });
    res.clearCookie('accessToken')
    res.status(200).json({ message: "success" });
});