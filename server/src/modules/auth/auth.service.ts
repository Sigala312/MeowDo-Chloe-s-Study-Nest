import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import appleSignin from 'apple-signin-auth';
import { prisma } from '../../lib/prisma.js';
import { RegisterInput, LoginInput, AppleAuthInput } from './auth.schema.js';

export class AuthService {
  // 簽發 JWT Token
  private static generateToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }

  // 1. 一般 Email 註冊
  static async register(input: RegisterInput) {
    const { name, email, password } = input;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // 2. 一般 Email 登入
  static async login(input: LoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // 3. Apple 第三方登入驗證
  static async authenticateApple(input: AppleAuthInput) {
    const { identityToken, user: appleUserData } = input;

    // 驗證 Apple Token
    const appleClaim = await appleSignin.verifyIdToken(identityToken, {
      clientId: process.env.APPLE_CLIENT_ID!,
    });

    const providerAccountId = appleClaim.sub;
    const email = appleClaim.email;
    const provider = 'apple';

    let account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { user: true },
    });

    let user = account?.user;

    if (!user) {
      if (email) {
        user = (await prisma.user.findUnique({ where: { email } })) ?? undefined;
      }

      if (!user) {
        const firstName = appleUserData?.name?.firstName || '';
        const lastName = appleUserData?.name?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || email?.split('@')[0] || 'Apple User';

        user = await prisma.user.create({
          data: {
            name: fullName,
            email: email || null,
          },
        });
      }

      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider,
          providerAccountId,
          id_token: identityToken,
        },
      });
    }

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // 4. Google 驗證完成後處理與使用者同步
  static async handleGoogleUser(profile: any, accessToken: string, refreshToken?: string) {
    const email = profile.emails?.[0]?.value;
    const providerAccountId = profile.id;
    const provider = 'google';

    if (!email) {
      throw new Error('NO_GOOGLE_EMAIL');
    }

    let account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { user: true },
    });

    let user = account?.user;

    if (!user) {
      user = (await prisma.user.findUnique({ where: { email } })) ?? undefined;

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: profile.displayName || email.split('@')[0],
            email,
            image: profile.photos?.[0]?.value,
          },
        });
      }

      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider,
          providerAccountId,
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    }

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // 5. 取得使用者完整資料 (Me)
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        level: true,
        exp: true,
        tokens: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user;
  }
}