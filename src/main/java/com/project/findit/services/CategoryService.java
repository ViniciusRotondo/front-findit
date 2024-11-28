package com.project.findit.services;

import com.project.findit.models.CategoryModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface CategoryService {
    public CategoryModel createCategory(CategoryModel categoryModel);
    public List<CategoryModel> getAllCategories();
    public Optional<CategoryModel> getCategoriesDetails(UUID id);
    public CategoryModel updateCategoryDatails(UUID id, CategoryModel categoryModel);
    public void deleteCategory(UUID id);
}
