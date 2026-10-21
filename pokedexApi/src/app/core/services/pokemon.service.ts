import { HttpClient } from '@angular/common/http';
import { Injectable, inject  } from '@angular/core';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { PokemonDetails, PokemonListResponse } from '../models/pokemon.model';

//  CORRETO (Apenas o @Injectable deve decorar a classe)
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient); // Sintaxe moderna com a função inject()
   private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

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
