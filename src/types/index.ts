/**
 * Types essentiels pour le développement d'agents Directive
 * 
 * Ce module réexporte les types depuis @directive/types et fournit
 * quelques utilitaires spécifiques au SDK.
 */

// ============================================================================
// RÉEXPORTS DEPUIS @directive/types (Source unique de vérité)
// ============================================================================

export type { 
  BaseAgentContext, 
  BaseAgentEvent,
  AgentMetadata,
  RegisterAgentOptions
} from '@directive/types';

export type { 
  DirectiveAgent 
} from '@directive/types/sdk';

// ============================================================================
// UTILITAIRES SPÉCIFIQUES AU SDK
// ============================================================================

// Import des types pour les helpers TypeScript
import type { BaseAgentContext, BaseAgentEvent, RegisterAgentOptions } from '@directive/types';

/**
 * Type helper pour créer un contexte d'agent typé
 * 
 * Usage:
 * ```typescript
 * interface MyContext extends AgentContext<{ customData: string }> {
 *   // Hérite de BaseAgentContext + vos données
 * }
 * ```
 */
export type AgentContext<T = {}> = BaseAgentContext & T;

/**
 * Type helper pour créer des événements d'agent typés
 * 
 * Usage:
 * ```typescript
 * type MyEvent = AgentEvent<{
 *   CUSTOM_ACTION: { payload: string };
 *   ANOTHER_EVENT: { data: number };
 * }>;
 * ```
 */
export type AgentEvent<T extends Record<string, any> = {}> = BaseAgentEvent | T[keyof T];

/**
 * Configuration minimale d'un projet Directive
 */
export interface DirectiveProjectConfig {
  application: {
    name: string;
    description: string;
    author: string;
    version: string;
    metadata?: {
      category?: string;
      tags?: string[];
    };
  };
}

/**
 * Fonction pour enregistrer un agent Directive
 * 
 * Note: Cette fonction fait le pont vers @directive/core
 * Elle n'est disponible que quand l'agent est chargé par le serveur Directive
 * 
 * Usage dans agent.ts:
 * ```typescript
 * import { createMachine } from 'xstate';
 * import type { RegisterAgentOptions } from '@directive/sdk';
 * 
 * const machine = createMachine({...});
 * 
 * // Enregistrement automatique à la compilation
 * registerAgent({
 *   type: 'my-project/my-agent',
 *   machine,
 *   metadata: {
 *     name: 'My Agent',
 *     description: 'Description de mon agent',
 *     version: '1.0.0'
 *   }
 * });
 * ```
 */
declare global {
  function registerAgent(options: RegisterAgentOptions): void;
} 