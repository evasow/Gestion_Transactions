<?php

namespace App\Http\Controllers;

use App\Http\Resources\CompteResource;
use App\Models\Compte;
use Illuminate\Http\Request;

class CompteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CompteResource::collection(Compte::all());
    }
    /**

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $validate = $request->validate([
        //     'solde' => 'bail|required|integer',
        // ]);
       $compte= Compte::firstOrCreate([
            "solde" => $request->solde,
            "numCompte" => $request->numCompte,
            "client_id" => $request->client_id,
            "etat" => 0,
            "blocage" => 0
        ]);
        return response()->json([
            "message" =>"compte créé avec succés",
            "data" =>$compte
        ]);

    }
    
    /**
     * Display the specified resource.
     */
    public function show(Compte $compte)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Compte $compte)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Compte $compte)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Compte $compte)
    {
        //
    }
}
