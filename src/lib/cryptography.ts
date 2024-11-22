import crypto from 'crypto';
const hashToBase64Url = (plain: string): string => {
    // returns promise ArrayBuffer
    const digest = crypto.createHash("sha256").update(plain).digest('base64url');
    return digest;
}


export const verifyChallenge = async (challenge: string, verifier: string): Promise<boolean> => {
    const transformedVerifier = hashToBase64Url(verifier);
    return transformedVerifier === challenge;
}