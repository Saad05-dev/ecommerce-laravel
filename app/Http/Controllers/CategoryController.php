<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')->parents()->orderBy('name')->get();
        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }
}
