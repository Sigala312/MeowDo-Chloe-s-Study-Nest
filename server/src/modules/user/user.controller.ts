import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { UpdateProfileSchema } from "./user.schema.js";

export class UserController {
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const profile = await UserService.getProfile(
        (req.user as { id: string }).id,
      );
      res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch user profile." });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const validatedData = UpdateProfileSchema.parse(req.body);
      const updatedProfile = await UserService.updateProfile(
        (req.user as { id: string }).id,
        validatedData,
      );
      res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        data: updatedProfile,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.errors?.[0]?.message || "Failed to update profile.",
      });
    }
  }
}
