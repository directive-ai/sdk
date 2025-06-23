/**
 * Directive SDK - Types et utilitaires pour le développement d'agents
 * 
 * Ce SDK fournit uniquement les types TypeScript et la configuration webpack
 * optimisée pour développer des agents Directive.
 * 
 * Usage:
 * ```typescript
 * import { BaseAgentContext, BaseAgentEvent, registerAgent } from '@directive/sdk';
 * import { createMachine } from 'xstate';
 * 
 * interface MyContext extends BaseAgentContext {
 *   customData: string;
 * }
 * 
 * const machine = createMachine<MyContext>({...});
 * 
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

// Types essentiels pour le développement d'agents
export * from './types/index.js';

// Configuration webpack optimisée
export * from './webpack/webpack.config.js'; 