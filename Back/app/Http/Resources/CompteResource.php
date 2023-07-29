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
            "solde" => $this->solde,
            "numéro compte" => $this->numCompte,
            "client" => $this->client,
            "transactions" => $this->transactions,
        ];
    }
}
