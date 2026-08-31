import { Request, Response } from 'express';
import { TagService } from './tag.service.js';
import { CreateTagSchema, UpdateTagSchema } from './tag.schema.js';

export class TagController {
  // 1. Get All Tags
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized access.' });
        return;
      }

      const userId = (req.user as { id: string }).id;
      const tags = await TagService.getTags(userId);
      res.status(200).json({ success: true, data: tags });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch tags.' });
    }
  }

  // 2. Create Tag
  static async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized access.' });
        return;
      }

      const userId = (req.user as { id: string }).id;
      const validatedData = CreateTagSchema.parse(req.body);

      const newTag = await TagService.createTag(userId, validatedData);
      res.status(201).json({
        success: true,
        message: 'Tag created successfully!',
        data: newTag,
      });
    } catch (error: any) {
      if (error.message === 'TAG_EXISTS') {
        res.status(400).json({
          success: false,
          message: 'A tag with this name already exists.',
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: error.errors?.[0]?.message || 'Invalid tag input data.',
      });
    }
  }

  // 3. Update Tag
  static async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized access.' });
        return;
      }

      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid Tag ID.' });
        return;
      }

      const userId = (req.user as { id: string }).id;
      const validatedData = UpdateTagSchema.parse(req.body);

      const updatedTag = await TagService.updateTag(id, userId, validatedData);
      res.status(200).json({
        success: true,
        message: 'Tag updated successfully!',
        data: updatedTag,
      });
    } catch (error: any) {
      if (error.message === 'TAG_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Tag not found or unauthorized access.',
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: error.errors?.[0]?.message || 'Failed to update tag.',
      });
    }
  }

  // 4. Delete Tag
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized access.' });
        return;
      }

      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid Tag ID.' });
        return;
      }

      const userId = (req.user as { id: string }).id;
      await TagService.deleteTag(id, userId);

      res.status(200).json({
        success: true,
        message: 'Tag deleted successfully.',
      });
    } catch (error: any) {
      if (error.message === 'TAG_NOT_FOUND') {
        res.status(404).json({
          success: false,
          message: 'Tag not found or unauthorized access.',
        });
        return;
      }
      res.status(500).json({ success: false, message: 'Failed to delete tag.' });
    }
  }
}