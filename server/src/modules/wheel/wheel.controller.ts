import { Request, Response } from 'express';
import { WheelService } from './wheel.service.js';
import { redeemRewardSchema } from './wheel.schema.js';

interface AuthRequest extends Request {
  user: {
    id: string;
    email?: string;
  };
}

export class WheelController {
  static async getStatus(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user.id;
      const data = await WheelService.getUserWheelStatus(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async earnTomato(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user.id;
      // 修改為對應 Task 完成發放番茄的新方法名稱
      const result = await WheelService.addTomatoForTask(userId);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async spin(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user.id;
      const result = await WheelService.spinWheel(userId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async redeem(req: Request, res: Response) {
    try {
      const userId = (req as AuthRequest).user.id;
      const parsed = redeemRewardSchema.parse(req.body);
      const result = await WheelService.redeemReward(userId, parsed.drawLogId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}