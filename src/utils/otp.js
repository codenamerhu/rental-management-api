exports.generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    return { otp, expiresAt };
};
