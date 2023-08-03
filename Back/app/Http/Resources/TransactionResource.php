<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "typeTrans"=> $this->typeTrans,
            "montantTrans" => $this->montantTrans,
            "fournisseur"=> $this->fournisseur,
            "destClient"=> $this->destClient,
            "client_dest"=> $this->client_dest
        ];
    }
}
