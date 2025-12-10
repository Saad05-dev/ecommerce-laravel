<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')->parents()->orderBy('name')->get();
        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }
    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Categories/Create' ,[
            'categories' => $categories,
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'description'    => ['nullable', 'string'],
            'parent_id' => ['nullable', 'exists:categories,id'],
            'is_active'      => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $data['is_active'] ?? true;
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();

        $categorie = Category::create($data);

        return redirect()->route('categories.index')->with('success','Categorie created.');
    }
    public function edit(Category $category)
    {
        $categories = Category::parents()->where('id','!=', $category->id)->orderBy('name')->get();

        return Inertia::render('Categories/Edit',[
            'category' => $category,
            'categories' => $categories,
        ]);
    }
    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['required','string','max:100'],
            'description' => ['nullable','string'],
            'parent_id' => ['nullable','exists:categories,id'],
            'is_active' => ['nullable','boolean'],
        ]);

        $data['is_active'] = $data['is_active'] ?? true;

        if ($category->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        }

        if (isset($data['parent_id']) && $data['parent_id'] == $category->id) {
            return back()->withErrors(['parent_id' => 'A category cannot be its own parent.']);
        }

        $category->update($data);

        return redirect()->route('categories.index')->with('success','Category updated successfully.');
    }
    public function destroy(Category $category)
    {
        if($category->products()->count() > 0)
        {
            return back()->withErrors(['error' => 'Cannot delete category with existing products.']);
        }

        if ($category->children()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete category with subcategories.']);
        }

        $category->delete();

        return redirect()->route('categories.index')->with('success','Category deleted successfully');
    }
}
