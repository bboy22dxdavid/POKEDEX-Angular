import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Garanta que a propriedade standalone esteja presente se usar Angular moderno
  imports: [RouterOutlet],
  template: `
    <main>
      <!-- O Angular injetará a lista de Pokémons ou a página de detalhes aqui -->
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f9;
      min-height: 100vh;
      padding: 20px;
    }
  `]
})
export class App { // Mantido como AppComponent para não quebrar o main.ts
  protected readonly title = signal('pokedexApi');
}
