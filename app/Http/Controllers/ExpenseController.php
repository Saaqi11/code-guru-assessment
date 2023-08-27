<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    /**
     * Expense listing
     * @return JsonResponse
     */
    public function getExpenses (): JsonResponse
    {
        $expenses = Expense::where("user_id", Auth::id())->get();
        return $this->sendResponse($expenses, "Expense Listing");
    }
}
