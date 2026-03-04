<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HandlesApiPagination
{
    /**
     * @return array{data: mixed, meta?: array<string, mixed>}
     */
    protected function paginatedData(Request $request, Builder $query, int $defaultPerPage = 25, int $maxPerPage = 100): array
    {
        $shouldPaginate = $this->shouldPaginate($request);
        if (! $shouldPaginate) {
            return ['data' => $query->get()];
        }

        $requested = (int) $request->query('per_page', $defaultPerPage);
        $perPage = max(1, min($requested > 0 ? $requested : $defaultPerPage, $maxPerPage));
        $paginator = $query->paginate($perPage)->appends($request->query());

        return [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'has_more_pages' => $paginator->hasMorePages(),
            ],
        ];
    }

    private function shouldPaginate(Request $request): bool
    {
        if ($request->query->has('page') || $request->query->has('per_page')) {
            return true;
        }

        $flag = $request->query('paginate');
        if ($flag === null) {
            return false;
        }

        return filter_var($flag, FILTER_VALIDATE_BOOLEAN);
    }
}
