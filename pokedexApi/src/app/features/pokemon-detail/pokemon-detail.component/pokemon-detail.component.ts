import { CommonModule, Location  } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../../core/services/pokemon.service';
import { PokemonDetails } from '../../../core/models/pokemon.model';

@Component({
  imports: [CommonModule],
  selector: 'app-pokemon-detail.component',
  styleUrl: './pokemon-detail.component.scss',
  templateUrl: './pokemon-detail.component.html',
})
export class PokemonDetailComponent implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly pokemonService = inject(PokemonService);
  private readonly location = inject(Location);

  pokemon = signal<PokemonDetails | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('nameOrId');
    if (param) {
      this.pokemonService.getPokemonByIdOrName(param).subscribe({
        next: (data) => {
          this.pokemon.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes', err);
          this.isLoading.set(false);
        }
      });
    }
  }

   goBack(): void {
    this.location.back();
  }
}
