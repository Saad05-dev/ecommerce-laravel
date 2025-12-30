<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "====== CLEANING UP TEST DATA ======\n\n";

echo "WARNING: This will delete ALL orders and order items!\n";
echo "This is only safe if you haven't started accepting real customer orders yet.\n\n";

echo "Are you sure you want to continue? Type 'YES' to proceed: ";
$confirmation = trim(fgets(STDIN));

if ($confirmation !== 'YES') {
    echo "Cancelled. No data was deleted.\n";
    exit;
}

echo "\n";

try {
    DB::beginTransaction();

    // Count before deletion
    $orderItemsCount = DB::table('order_items')->count();
    $ordersCount = DB::table('orders')->count();

    echo "Found:\n";
    echo "  - {$ordersCount} orders\n";
    echo "  - {$orderItemsCount} order items\n\n";

    // Delete order items first (due to foreign key constraints)
    echo "Deleting order items...";
    DB::table('order_items')->delete();
    echo " Done!\n";

    // Delete orders
    echo "Deleting orders...";
    DB::table('orders')->delete();
    echo " Done!\n";

    DB::commit();

    echo "\n✓ SUCCESS: All test orders and order items have been deleted!\n";
    echo "You can now delete any product without the 'has been ordered' error.\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n✗ ERROR: {$e->getMessage()}\n";
}
