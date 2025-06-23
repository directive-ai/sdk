# @directive/sdk

> Types TypeScript et configuration webpack pour développer des agents Directive

## Pourquoi ce SDK ?

Le SDK Directive fournit **uniquement l'essentiel** :

- ✅ **Types TypeScript** pour développer des agents typés
- ✅ **Configuration webpack optimisée** avec externals automatiques
- ✅ **Interface `registerAgent()`** pour enregistrer vos agents

**Ce qu'il NE fait PAS** (et c'est volontaire) :
- ❌ CLI (c'est le rôle de `@directive/core`)
- ❌ Templates (c'est le rôle de `directive create agent`)
- ❌ Outils de build complexes (webpack suffit)

## Installation

```bash
# Le SDK est automatiquement installé quand vous créez un projet
directive create app my-project
cd my-project
# @directive/sdk est déjà dans package.json
```

## Usage

### 1. Développer un agent typé

```typescript
import { createMachine } from 'xstate';
import type { BaseAgentContext, BaseAgentEvent, AgentContext, AgentEvent, registerAgent } from '@directive/sdk';

// Définir votre contexte spécifique
interface WorkflowContext extends BaseAgentContext {
  workflowData: any;
  currentStep: number;
}

// Définir vos événements spécifiques
type WorkflowEvent = BaseAgentEvent | 
  | { type: 'NEXT_STEP'; step: number }
  | { type: 'WORKFLOW_COMPLETE'; result: any };

// Créer votre machine XState typée
export const workflowMachine = createMachine<WorkflowContext, WorkflowEvent>({
  id: 'workflow',
  initial: 'idle',
  context: {
    currentState: 'idle',
    workflowData: null,
    currentStep: 0
  },
  states: {
    idle: {
      on: {
        START: {
          target: 'processing',
          actions: assign({
            currentState: 'processing',
            workflowData: ({ event }) => event.data
          })
        }
      }
    },
    processing: {
      on: {
        NEXT_STEP: {
          target: 'processing',
          actions: assign({
            currentStep: ({ event }) => event.step
          })
        },
        WORKFLOW_COMPLETE: {
          target: 'success',
          actions: assign({
            currentState: 'success',
            result: ({ event }) => event.result
          })
        }
      }
    },
    success: { type: 'final' }
  }
});

// Enregistrer votre agent (OBLIGATOIRE)
registerAgent({
  type: 'my-project/workflow',  // Format: "project/agent"
  machine: workflowMachine,
  metadata: {
    name: 'Workflow Agent',
    description: 'Gère les workflows métier',
    version: '1.0.0',
    author: 'Mon équipe'
  }
});
```

### 2. Configuration webpack optimisée

Votre `webpack.config.js` (généré par `directive create app`) :

```javascript
const { createWebpackConfig } = require('@directive/sdk/webpack');

module.exports = (env, argv) => {
  return createWebpackConfig({
    mode: argv.mode || 'development',
    entry: env && env.agent 
      ? `./agents/${env.agent}/agent.ts`
      : './agents/**/agent.ts'
    // Externals automatiques : xstate, @directive/core
  });
};
```

## Types Disponibles

### Contexte de base
```typescript
interface BaseAgentContext {
  currentState: string;
  requestData?: any;
  result?: any;
  error?: string;
  sessionId?: string;
  sessionMetadata?: Record<string, any>;
}
```

### Événements de base
```typescript
type BaseAgentEvent =
  | { type: 'START'; data?: any }
  | { type: 'PROCESS'; payload: any }
  | { type: 'SUCCESS'; result: any }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' }
  | { type: 'TIMEOUT' }
  | { type: 'CANCEL' };
```

### Types utilitaires
```typescript
// Helper pour étendre le contexte
type AgentContext<T = {}> = BaseAgentContext & T;

// Helper pour étendre les événements  
type AgentEvent<T extends Record<string, any> = {}> = BaseAgentEvent | T[keyof T];
```

## Workflow de développement

### 1. Créer un projet
```bash
directive init                    # Setup global
directive create app my-project   # Installe automatiquement le SDK
```

### 2. Créer un agent
```bash
cd my-project
directive create agent workflow   # Génère la structure de base
```

### 3. Développer avec types
```bash
# Le SDK fournit les types pour développer
npm run dev                       # Webpack en mode watch
```

### 4. Déployer
```bash
directive deploy agent workflow   # Le Core s'occupe du déploiement
```

## Architecture

```
@directive/core (Global)          @directive/sdk (Local)
├── CLI (init, create, deploy)  →  ├── Types TypeScript
├── Serveur Nest.js            │  ├── Configuration webpack
├── Base de données globale    │  └── Interface registerAgent()
└── Templates de base          │
                              │
Projet utilisateur            │  
├── package.json (avec SDK)   ←──┘
├── agents/
│   └── workflow/
│       └── agent.ts (utilise SDK)
└── webpack.config.js (utilise SDK)
```

## Principe de conception

Le SDK suit le principe **"Faire une seule chose bien"** :

- **Core** = Orchestration globale (CLI, serveur, BDD)
- **SDK** = Types + outils de développement
- **Séparation claire** = Pas de duplication

Cette approche évite :
- ❌ Duplication de code entre Core et SDK
- ❌ Confusion sur qui fait quoi  
- ❌ CLI complexe avec plusieurs outils

Et garantit :
- ✅ Expérience développeur optimale
- ✅ Types complets pour XState + Directive
- ✅ Configuration webpack optimisée
- ✅ Architecture simple et maintenable

## API Reference

### `registerAgent(options: RegisterAgentOptions): void`

Enregistre un agent auprès du système Directive.

```typescript
interface RegisterAgentOptions {
  type: string;           // "project/agent"
  machine: any;           // Machine XState  
  metadata: AgentMetadata;
}

interface AgentMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
}
```

### `createWebpackConfig(options)`

Crée une configuration webpack optimisée pour Directive.

```typescript
createWebpackConfig({
  mode: 'development' | 'production',
  entry: string | string[],
  // Autres options webpack...
})
```

## Support

- 📖 [Documentation Directive](https://directive.ai/docs)
- 🐛 [Issues GitHub](https://github.com/directive-ai/directive/issues)
- 💬 [Discussions](https://github.com/directive-ai/directive/discussions) 