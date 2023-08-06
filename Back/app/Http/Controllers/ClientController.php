<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Compte;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $client= Client::firstOrCreate([
            "nom" => $request->nom,
            "prenom" => $request->prenom,
            "tel" => $request->tel,
        ]);

        return response()->json([
            "client" => $client,
            "message" => "Client inséré avec succes"
        ]);
    }
    
    public function getClientByTelOrNumCompte(string $keySearch){
        $data=explode("_",$keySearch);
        if(count($data)==1  && strlen($data[0])==9){
      
            $client = Client::clientByTel($data[0])->first();
            $message = "";
            if(!$client)
            {
                $message = "Le numero ne correspond pas à un client";

            }
            return response()->json(["message"=>$message,
            "data"=>
                Client::clientByTel($data[0])->first()
            ]);
        }
        else{
            return response()->json(["message"=>"Le numero ne correspond pas à un client",
            "data"=>
                []
            ]);
        }
        if(count($data)==2  && strlen($data[1])==9 && strlen($data[0])==2){
            
             $client= Client::clientByTel($data[1])->first();
             if($client){
                
                $fournisseur=Compte::where('client_id',$client->id)
                ->where('fournisseur',$data[0])->first();
                if($fournisseur){
                    return response()->json(["message"=>"",
                    "data"=>
                        $client
                    ]);
                }
                return response()->json(["message"=>"ce client ne dispose pas de compte pour ce fourniseur",
            "data"=>[]]);

             }
             return response()->json(["message"=>"ce client existe pas",
            "data"=>[]]);
            

        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
