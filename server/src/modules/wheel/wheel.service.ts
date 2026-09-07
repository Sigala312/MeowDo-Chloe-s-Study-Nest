import { prisma } from '../../lib/prisma.js';

export class WheelService {
  /**
   * Get user status (tomatoes, last draw log, rewards list)
   */
  static async getUserWheelStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tomatoes: true,
        todayTomatoesCount: true,
        lastTomatoDate: true,
      },
    });

    if (!user) throw new Error('User not found');

    const today = new Date().toDateString();
    const lastDate = new Date(user.lastTomatoDate).toDateString();
    const todayTomatoes = today === lastDate ? user.todayTomatoesCount : 0;

    const lastDraw = await prisma.wheelDrawLog.findFirst({
      where: { userId },
      orderBy: { drawnAt: 'desc' },
      include: { reward: true },
    });

    const rewards = await prisma.wheelReward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      tomatoes: user.tomatoes,
      todayTomatoesCount: todayTomatoes,
      lastDraw: lastDraw
        ? {
            rewardTitle: lastDraw.reward.title,
            drawnAt: lastDraw.drawnAt,
            isRedeemed: lastDraw.isRedeemed,
          }
        : null,
      rewards,
    };
  }

  /**
   * Complete a task to earn tomatoes:
   * - 1 tomato per completed task
   * - Completing the 7th task awards a 3-tomato bonus (hitting the 10/10 daily cap)
   */
  static async addTomatoForTask(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const today = now.toDateString();
    const lastDate = new Date(user.lastTomatoDate).toDateString();

    let currentTodayCount = user.todayTomatoesCount;

    // Reset daily counter if it's a new day
    if (today !== lastDate) {
      currentTodayCount = 0;
    }

    // Check if daily cap (10) is already reached
    if (currentTodayCount >= 10) {
      return {
        success: false,
        message: 'Daily cat food limit reached (10/10) 🐾',
        tomatoes: user.tomatoes,
        todayTomatoesCount: currentTodayCount,
      };
    }

    // Logic: 1 tomato per task. If this is the 7th task, add +1 (base) + 3 (bonus) = 4 tomatoes
    let earnedTomatoes = 1;
    let isBonusTriggered = false;

    if (currentTodayCount + 1 === 7) {
      earnedTomatoes = 1 + 3; // 4 tomatoes in total for the 7th task
      isBonusTriggered = true;
    }

    const newTodayCount = currentTodayCount + earnedTomatoes;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        tomatoes: { increment: earnedTomatoes },
        todayTomatoesCount: newTodayCount,
        lastTomatoDate: now,
      },
    });

    return {
      success: true,
      message: isBonusTriggered
        ? '🎉 Completed 7 tasks today! Earned 1 cat food + 3 bonus cat foods! 🥫'
    : `Successfully earned ${earnedTomatoes} cat food! 🥫`,
      earnedTomatoes,
      tomatoes: updatedUser.tomatoes,
      todayTomatoesCount: updatedUser.todayTomatoesCount,
    };
  }

  /**
   * Spin the wheel (Consumes 30 tomatoes)
   */
  static async spinWheel(userId: string) {
    const COST = 30;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    if (user.tomatoes < COST) {
      throw new Error(`Not enough cat foods ! Spinning requires ${COST} cat foods 🥫.`);
    }

    const rewards = await prisma.wheelReward.findMany({ where: { userId } });
    if (rewards.length === 0) {
      throw new Error('No rewards available. Please add rewards first.');
    }

    const drawnReward = this.getRandomReward(rewards);

    const [updatedUser, drawLog] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { tomatoes: { decrement: COST } },
      }),
      prisma.wheelDrawLog.create({
        data: {
          userId,
          rewardId: drawnReward.id,
        },
        include: { reward: true },
      }),
    ]);

    return {
      drawnReward: drawLog.reward,
      remainingTomatoes: updatedUser.tomatoes,
      drawLogId: drawLog.id,
    };
  }

  /**
   * Redeem reward coupon
   */
  static async redeemReward(userId: string, drawLogId: string) {
    const log = await prisma.wheelDrawLog.findUnique({ where: { id: drawLogId } });

    if (!log || log.userId !== userId) {
      throw new Error('Draw log not found or unauthorized.');
    }
    if (log.isRedeemed) {
      throw new Error('This reward has already been redeemed.');
    }

    return await prisma.wheelDrawLog.update({
      where: { id: drawLogId },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
      },
      include: { reward: true },
    });
  }

  /**
   * Weighted random selection helper
   */
  private static getRandomReward(rewards: any[]) {
    const totalProbability = rewards.reduce((sum, r) => sum + r.probability, 0);
    let randomNum = Math.random() * totalProbability;

    for (const reward of rewards) {
      if (randomNum < reward.probability) {
        return reward;
      }
      randomNum -= reward.probability;
    }
    return rewards[0];
  }
}