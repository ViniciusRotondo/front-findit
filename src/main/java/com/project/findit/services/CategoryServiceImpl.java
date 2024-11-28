package com.project.findit.services;

import com.project.findit.models.CategoryModel;
import com.project.findit.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoryServiceImpl implements CategoryService{

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public CategoryModel createCategory(CategoryModel categoryModel) {
        return categoryRepository.save(categoryModel);
    }

    @Override
    public List<CategoryModel> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<CategoryModel> getCategoriesDetails(UUID id) {
        return categoryRepository.findById(id);
    }

    @Override
    public CategoryModel updateCategoryDatails(UUID id, CategoryModel categoryModel) {
        CategoryModel existingCategory = categoryRepository.findById(id).orElse(null);

        if (existingCategory != null) {
            existingCategory.setNome(categoryModel.getNome());

            return categoryRepository.save(existingCategory);
        } else {
            throw new RuntimeException("Categoria não encontrada com esse id: " + id);
        }
    }

    @Override
    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }
}
