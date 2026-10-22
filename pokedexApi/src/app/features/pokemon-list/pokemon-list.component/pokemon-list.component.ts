import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../../core/services/pokemon.service';
import { PokemonDetails } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  private readonly pokemonService = inject(PokemonService);

  pokemons = signal<PokemonDetails[]>([]);
  isLoading = signal<boolean>(true);
  isSearching = signal<boolean>(false);
  searchResult = signal<PokemonDetails | null>(null);
  searchError = signal<string | null>(null);
  displayedPokemon = computed(() => this.searchResult() ?? this.pokemons()[0] ?? null);
  limit = 20;
  offset = 0;

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    this.isLoading.set(true);

    // CORREÇÃO: Passamos apenas as variáveis numéricas (limit, offset).
    // O serviço cuidará de montar a URL correta (https://pokeapi.co).
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: (data) => {
        this.pokemons.update(current => [...current, ...data]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémons', err);
        this.isLoading.set(false);
      }
    });
  }

  loadMore(): void {
    this.offset += this.limit;
    this.loadPokemons();
  }

  searchPokemon(name: string, event: Event): void {
    event.preventDefault();
    const normalizedName = name.trim().toLowerCase();

    if (!normalizedName) {
      this.searchResult.set(null);
      this.searchError.set('Digite o nome de um Pokémon para pesquisar.');
      return;
    }

    this.isSearching.set(true);
    this.searchResult.set(null);
    this.searchError.set(null);

    this.pokemonService.getPokemonByIdOrName(normalizedName).subscribe({
      next: (pokemon) => {
        this.searchResult.set(pokemon);
        this.isSearching.set(false);
      },
      error: () => {
        this.searchError.set('Pokémon não encontrado. Confira o nome e tente novamente.');
        this.isSearching.set(false);
      }
    });
  }

  pokemonImage(pokemon: PokemonDetails): string {
    return pokemon.sprites.other?.['official-artwork']?.front_default
      || pokemon.sprites.front_default;
  }
}
