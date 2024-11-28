package com.project.findit.controllers;

import com.project.findit.models.CategoryModel;
import com.project.findit.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @PostMapping("/category")
    public CategoryModel addCategoryDatails(@RequestBody CategoryModel categoryModel){
        return categoryService.createCategory(categoryModel);
    }

    @GetMapping("/category")
    public List<CategoryModel> getAllCategoriesDetails(){
        return categoryService.getAllCategories();
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<CategoryModel> getCategoryDetails(@PathVariable UUID id){
        CategoryModel category = categoryService.getCategoriesDetails(id).orElse(null);
        if(category != null){
            return ResponseEntity.ok().body(category);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<CategoryModel> updateCategoryDatails(@PathVariable UUID id, @RequestBody CategoryModel categoryModel){
        CategoryModel updateCategory = categoryService.updateCategoryDatails(id, categoryModel);
        if(updateCategory != null){
            return ResponseEntity.ok(updateCategory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id){
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
