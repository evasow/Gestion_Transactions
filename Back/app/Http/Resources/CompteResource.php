<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "solde" => $this->solde,
            "numCompte" => $this->numCompte,
            "client" => $this->client,
            "transactions" => TransactionResource::collection($this->transactions),
        ];
    }
}
