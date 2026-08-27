import { Request, Response } from 'express';
import { CategoryService } from './category.service.js';
import { CreateCategorySchema, UpdateCategorySchema } from './category.schema.js';

export class CategoryController {
  // 1. Get All Categories
  static async getAll(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;
      const categories = await CategoryService.getCategories(userId);
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch categories. Please try again later.' 
      });
    }
  }

  // 2. Create Category (Includes Name + Icon)
  static async create(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;
      const validatedData = CreateCategorySchema.parse(req.body);

      const newCategory = await CategoryService.createCategory(userId, validatedData);
      return res.status(201).json({ 
        success: true, 
        message: 'Category created successfully!',
        data: newCategory 
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_EXISTS') {
        return res.status(400).json({ 
          success: false, 
          message: 'A category with this name already exists.' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: error.errors?.[0]?.message || 'Invalid category input data.' 
      });
    }
  }

  // 3. Update Category
  static async update(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;
      const { id } = req.params;
      const validatedData = UpdateCategorySchema.parse(req.body);

      const updatedCategory = await CategoryService.updateCategory(id as string, userId, validatedData);
      return res.status(200).json({ 
        success: true, 
        message: 'Category updated successfully!',
        data: updatedCategory 
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found or unauthorized access.' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: error.errors?.[0]?.message || 'Failed to update category.' 
      });
    }
  }

  // 4. Delete Category
  static async delete(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;
      const { id } = req.params;

      await CategoryService.deleteCategory(id as string, userId);
      return res.status(200).json({ 
        success: true, 
        message: 'Category deleted successfully.' 
      });
    } catch (error: any) {
      if (error.message === 'CATEGORY_NOT_FOUND') {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found or unauthorized access.' 
        });
      }
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete category.' 
      });
    }
  }
}