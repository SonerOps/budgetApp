# Guide Angular pour Débutants - Budget App

**Développé par : Otmanelaissi@gmail.com**

Ce guide explique les concepts Angular utilisés dans l'application Budget App.

## 🎯 Concepts de base

### 1. Component (Composant)
Un composant = une partie de l'interface utilisateur

```typescript
@Component({
  selector: 'app-dashboard',    // Nom du tag HTML
  template: `<h1>Hello</h1>`,   // Code HTML
  styles: [`h1 { color: blue; }`] // Styles CSS
})
export class DashboardComponent {
  // Logique du composant
}
```

### 2. Service
Un service = classe qui contient la logique métier

```typescript
@Injectable({
  providedIn: 'root'  // Disponible dans toute l'app
})
export class BudgetService {
  // Méthodes pour gérer les budgets
}
```

### 3. Dependency Injection (Injection de dépendances)
Angular fournit automatiquement les services dans le constructeur

```typescript
constructor(
  private budgetService: BudgetService,  // Angular injecte automatiquement
  private router: Router
) {}
```

## 🔄 Flux de données

### 1. Interpolation {{ }}
Affiche une valeur dans le template

```html
<h1>{{ titre }}</h1>
<p>Budget: {{ montant | currency:'EUR' }}</p>
```

### 2. Property Binding [ ]
Lie une propriété HTML à une variable

```html
<input [value]="titre" [disabled]="loading">
<div [ngClass]="{ 'text-success': solde > 0 }">
```

### 3. Event Binding ( )
Écoute les événements

```html
<button (click)="sauvegarder()">Sauvegarder</button>
<form (ngSubmit)="onSubmit()">
```

### 4. Two-way Binding [( )]
Liaison bidirectionnelle

```html
<input [(ngModel)]="titre">
<!-- Équivalent à : -->
<input [ngModel]="titre" (ngModelChange)="titre = $event">
```

## 📋 Directives structurelles

### 1. *ngIf - Affichage conditionnel

```html
<!-- Affiche seulement si loading est true -->
<div *ngIf="loading">Chargement...</div>

<!-- Avec alternative -->
<div *ngIf="budgets.length > 0; else noBudgets">
  <p>{{ budgets.length }} budgets trouvés</p>
</div>
<ng-template #noBudgets>
  <p>Aucun budget</p>
</ng-template>
```

### 2. *ngFor - Boucles

```html
<!-- Répète pour chaque budget -->
<div *ngFor="let budget of budgets; let i = index">
  <h3>{{ i + 1 }}. {{ budget.titre }}</h3>
  <p>{{ budget.montant }}€</p>
</div>
```

### 3. *ngSwitch - Conditions multiples

```html
<div [ngSwitch]="categorie">
  <p *ngSwitchCase="'Alimentation'">🍽️ Nourriture</p>
  <p *ngSwitchCase="'Transport'">🚗 Transport</p>
  <p *ngSwitchDefault>📦 Autre</p>
</div>
```

## 📝 Formulaires réactifs

### 1. Création du formulaire

```typescript
// Dans le composant
budgetForm = this.fb.group({
  titre: ['', [Validators.required, Validators.maxLength(100)]],
  montant: ['', [Validators.required, Validators.min(0)]],
  categorie: ['', Validators.required]
});
```

### 2. Template du formulaire

```html
<form [formGroup]="budgetForm" (ngSubmit)="onSubmit()">
  <!-- Champ titre -->
  <input 
    type="text" 
    formControlName="titre"
    [class.is-invalid]="budgetForm.get('titre')?.invalid && budgetForm.get('titre')?.touched">
  
  <!-- Messages d'erreur -->
  <div *ngIf="budgetForm.get('titre')?.invalid && budgetForm.get('titre')?.touched">
    <div *ngIf="budgetForm.get('titre')?.errors?.['required']">
      Le titre est requis
    </div>
  </div>
  
  <button type="submit" [disabled]="budgetForm.invalid">
    Sauvegarder
  </button>
</form>
```

### 3. Validation

```typescript
// Vérifier si le formulaire est valide
if (this.budgetForm.valid) {
  const data = this.budgetForm.value;
  // Envoyer les données
}

// Accéder à un contrôle spécifique
const titreControl = this.budgetForm.get('titre');
if (titreControl?.invalid) {
  console.log('Titre invalide');
}
```

## 🔄 Observables et HTTP

### 1. Observable
Un Observable = flux de données asynchrone

```typescript
// Créer un Observable
const budgets$ = this.budgetService.getAllBudgets();

// S'abonner aux données
budgets$.subscribe({
  next: (data) => {
    console.log('Données reçues:', data);
    this.budgets = data;
  },
  error: (error) => {
    console.error('Erreur:', error);
    this.errorMessage = error;
  },
  complete: () => {
    console.log('Terminé');
    this.loading = false;
  }
});
```

### 2. Requêtes HTTP

```typescript
// GET - Récupérer des données
this.http.get<Budget[]>('/api/budgets').subscribe(budgets => {
  this.budgets = budgets;
});

// POST - Créer des données
this.http.post<Budget>('/api/budgets', newBudget).subscribe(budget => {
  console.log('Budget créé:', budget);
});

// PUT - Modifier des données
this.http.put<Budget>('/api/budgets/123', updatedBudget).subscribe();

// DELETE - Supprimer des données
this.http.delete('/api/budgets/123').subscribe();
```

## 🎨 Pipes (Transformations)

### 1. Pipes intégrés

```html
<!-- Formatage de devise -->
{{ montant | currency:'EUR':'symbol':'1.2-2':'fr' }}
<!-- Résultat : 123,45 € -->

<!-- Formatage de date -->
{{ date | date:'short':'fr' }}
<!-- Résultat : 15/01/2024 10:30 -->

<!-- Texte en majuscules -->
{{ titre | uppercase }}

<!-- JSON pour debug -->
{{ budget | json }}
```

### 2. Pipe personnalisé

```typescript
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
```

```html
{{ longText | truncate:30 }}
```

## 🧭 Routing (Navigation)

### 1. Configuration des routes

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'budgets', component: BudgetListComponent },
  { path: 'budgets/new', component: BudgetFormComponent },
  { path: 'budgets/edit/:id', component: BudgetFormComponent }
];
```

### 2. Navigation

```typescript
// Navigation programmatique
this.router.navigate(['/budgets']);
this.router.navigate(['/budgets/edit', budgetId]);

// Récupérer les paramètres
const id = this.route.snapshot.paramMap.get('id');
```

### 3. Liens dans le template

```html
<!-- Lien simple -->
<a routerLink="/dashboard">Tableau de bord</a>

<!-- Lien avec paramètre -->
<a [routerLink]="['/budgets/edit', budget.id]">Modifier</a>

<!-- Classe active -->
<a routerLink="/budgets" routerLinkActive="active">Budgets</a>
```

## 🔄 Lifecycle Hooks

### 1. ngOnInit
Appelée après la création du composant

```typescript
ngOnInit(): void {
  // Charger les données initiales
  this.loadBudgets();
}
```

### 2. ngOnDestroy
Appelée avant la destruction du composant

```typescript
ngOnDestroy(): void {
  // Nettoyer les abonnements
  this.subscription?.unsubscribe();
}
```

## 🎯 Bonnes pratiques

### 1. Gestion des erreurs

```typescript
this.budgetService.getAllBudgets().subscribe({
  next: (budgets) => {
    this.budgets = budgets;
    this.loading = false;
  },
  error: (error) => {
    this.errorMessage = 'Erreur lors du chargement';
    this.loading = false;
    console.error(error);
  }
});
```

### 2. Unsubscribe des Observables

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.budgetService.getAllBudgets()
      .pipe(takeUntil(this.destroy$))
      .subscribe(budgets => this.budgets = budgets);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 3. Typage TypeScript

```typescript
// Interface pour typer les données
interface Budget {
  id: string;
  titre: string;
  montant: number;
  categorie: string;
}

// Typage des méthodes
getBudgets(): Observable<Budget[]> {
  return this.http.get<Budget[]>('/api/budgets');
}
```

## 🔧 Debugging

### 1. Console du navigateur

```typescript
// Afficher des données
console.log('Budgets:', this.budgets);
console.error('Erreur:', error);

// Breakpoint dans le code
debugger;
```

### 2. Angular DevTools
Extension Chrome/Firefox pour inspecter les composants Angular

### 3. Template debugging

```html
<!-- Afficher les données JSON -->
<pre>{{ budget | json }}</pre>

<!-- Vérifier les conditions -->
<p>Loading: {{ loading }}</p>
<p>Error: {{ error }}</p>
```

---

Ce guide couvre les concepts essentiels d'Angular utilisés dans Budget App. Pour approfondir, consultez la [documentation officielle Angular](https://angular.io/docs).