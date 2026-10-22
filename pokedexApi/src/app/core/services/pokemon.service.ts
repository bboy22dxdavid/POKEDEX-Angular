import { HttpClient } from '@angular/common/http';
import { Injectable, inject  } from '@angular/core';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { PokemonDetails, PokemonListResponse } from '../models/pokemon.model';

//  CORRETO (Apenas o @Injectable deve decorar a classe)
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly  http = inject(HttpClient); // Sintaxe moderna com a função inject()/api-pokemon/api/v2/pokemon
   private readonly  apiUrl = '/api-pokemon/api/v2/pokemon';

   /*getPokemons() {
    const url = 'https://pokeapi.co/api/v2/pokemon/ditto';https://pokeapi.co/api/v2/pokemon
    console.log("chamando a api: ", this.http.get(url));
    // Use apenas a URL, sem passar objetos de configuração extras de headers
    return this.http.get(url);
  }*/

  getPokemons(limit: number = 20, offset: number = 0): Observable<PokemonDetails[]> {
    // CORREÇÃO 2: Trocado o segundo '?' por '&' antes do offset para separar os parâmetros corretamente
    return this.http.get<PokemonListResponse>(`${this.apiUrl}?limit=${limit}&offset=${offset}`).pipe(
      switchMap(response => {
        const detailRequests = response.results.map(pokemon =>
          this.http.get<PokemonDetails>(pokemon.url)
        );
        return forkJoin(detailRequests);
      })
    );
  }

  getPokemonByIdOrName(param: string | number): Observable<PokemonDetails> {

    return this.http.get<PokemonDetails>(`${this.apiUrl}/${param}`);
  }
}


