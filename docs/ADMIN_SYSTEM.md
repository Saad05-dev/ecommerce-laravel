# Admin Role System

This application implements a role-based access control system for admin users.

## Overview

- Regular users can browse products, add items to cart, and place orders
- Admin users have additional access to the admin dashboard where they can manage products, categories, and orders
- By default, all new registered users are **NOT** admins (is_admin = false)

## How It Works

### Database
- The `users` table has an `is_admin` boolean field (default: false)
- Only users with `is_admin = true` can access admin routes

### Middleware
- **IsAdmin Middleware**: Checks if the authenticated user has admin privileges
- Non-admin users attempting to access admin routes are redirected to the homepage with an error message
- Admin routes are protected with both `auth` and `admin` middleware

### Protected Routes
All routes under `/admin/*` and `/dashboard` are protected and require admin access:
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/products` - Product management
- `/admin/categories` - Category management

## Making a User an Admin

### Method 1: Using Artisan Command (Recommended)
Run this command to grant admin privileges to any user by their email:

```bash
php artisan user:make-admin user@example.com
```

### Method 2: Using Tinker
You can also use Laravel Tinker:

```bash
php artisan tinker
```

Then run:
```php
$user = App\Models\User::where('email', 'user@example.com')->first();
$user->is_admin = true;
$user->save();
```

### Method 3: Direct Database Update
You can directly update the database:

```sql
UPDATE users SET is_admin = 1 WHERE email = 'user@example.com';
```

## User Registration Flow

1. User fills out registration form
2. User account is created with `is_admin = false` by default
3. User is logged in and redirected to the **homepage** (not admin dashboard)
4. To access admin features, the user must be granted admin privileges using one of the methods above

## Admin vs Regular User Experience

### Regular User
- After registration → Redirected to homepage
- Can browse products and make purchases
- Cannot access `/admin/*` or `/dashboard` routes
- Attempting to access admin routes → Redirected to homepage with error

### Admin User
- Can access all regular user features
- Can access admin dashboard at `/admin/dashboard` or `/dashboard`
- Can manage products and categories
- Full CRUD operations on store content

## Security Notes

- Never hardcode admin status in the registration controller
- Admin privileges should only be granted intentionally by existing admins or system administrators
- Keep track of who has admin access
- Consider implementing audit logging for admin actions in the future

## Future Enhancements

Consider implementing:
- Multiple role levels (super admin, moderator, etc.)
- Admin user management interface
- Activity logs for admin actions
- Permission-based access control (more granular than admin/user)
