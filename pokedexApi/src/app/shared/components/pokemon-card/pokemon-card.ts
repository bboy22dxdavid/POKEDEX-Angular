import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PokemonDetails } from '../../../core/models/pokemon.model';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-pokemon-card',
  styleUrl: './pokemon-card.scss',
  templateUrl: './pokemon-card.html',
})
export class PokemonCard {
  // Input obrigatório recebendo os detalhes do Pokémon do componente pai
  @Input({ required: true }) pokemon!: PokemonDetails;

    get pokemonImage(): string {
    return this.pokemon.sprites.other?.['official-artwork']?.front_default || this.pokemon.sprites.front_default;
  }
}
