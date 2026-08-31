import { prisma } from '../../lib/prisma.js';
import { UpdateProfileInput } from './user.schema.js';

export class UserService {
  // 取得使用者個人資料
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            tasks: true,
            categories: true,
          },
        },
      },
    });

    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }

  // 更新個人資料
  static async updateProfile(userId: string, data: UpdateProfileInput) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
      },
    });
  }
}