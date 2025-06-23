/**
 * Configuration webpack par défaut pour les agents Directive
 */

import * as path from 'path';
import type { Configuration } from 'webpack';

export interface WebpackOptions {
  /** Nom de l'agent à compiler (ex: "monitoring") */
  agent?: string;
  
  /** Mode de compilation */
  mode?: 'development' | 'production';
  
  /** Répertoire source des agents */
  agentsDir?: string;
  
  /** Répertoire de sortie */
  outputDir?: string;
  
  /** Externals supplémentaires */
  externals?: Record<string, string>;
  
  /** Options avancées */
  advanced?: {
    /** Activer les source maps */
    sourceMaps?: boolean;
    
    /** Optimisations custom */
    optimization?: any;
    
    /** Plugins supplémentaires */
    plugins?: any[];
  };
}

/**
 * Crée une configuration webpack pour les agents Directive
 */
export function createWebpackConfig(options: WebpackOptions = {}): Configuration {
  const {
    agent,
    mode = 'production',
    agentsDir = './agents',
    outputDir = './dist',
    externals = {},
    advanced = {}
  } = options;

  const isProduction = mode === 'production';
  const isAgent = Boolean(agent);

  const config: Configuration = {
    mode,
    target: 'node',
    
    // Entry: agent spécifique ou tous les agents
    entry: isAgent 
      ? path.join(agentsDir, agent!, 'agent.ts') // agent est défini si isAgent est true
      : path.join(agentsDir, '**/agent.ts'),

    // Configuration des modules
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // Performance : ignore les erreurs TS
              compilerOptions: {
                strict: false,
                noImplicitAny: false,
                strictNullChecks: false,
                target: 'ES2022',
                module: 'ESNext'
              }
            }
          },
          exclude: /node_modules/,
        }
      ]
    },

    // Résolution des modules
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(process.cwd(), agentsDir)
      }
    },

    // Configuration de sortie
    output: {
      path: path.resolve(process.cwd(), outputDir),
      filename: isAgent ? `${agent!}.js` : '[name].js',
      library: 'Agent',
      libraryTarget: 'commonjs2',
      clean: true
    },

    // External dependencies (fournies par @directive/core)
    externals: {
      'xstate': 'commonjs xstate',
      '@directive/core': 'commonjs @directive/core',
      '@directive/sdk': 'commonjs @directive/sdk',
      ...externals
    },

    // Optimisations
    optimization: {
      minimize: isProduction,
      ...advanced.optimization
    },

    // Source maps
    devtool: advanced.sourceMaps !== false 
      ? (isProduction ? 'source-map' : 'eval-source-map')
      : false,

    // Plugins
    plugins: [
      ...(advanced.plugins || [])
    ],

    // Configuration pour les performances
    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: 250000,
      maxEntrypointSize: 250000
    },

    // Stats pour le build
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  };

  return config;
}

/**
 * Configuration webpack prédéfinie pour le développement
 */
export function createDevConfig(options: Omit<WebpackOptions, 'mode'> = {}): Configuration {
  return createWebpackConfig({
    ...options,
    mode: 'development',
    advanced: {
      sourceMaps: true,
      ...options.advanced
    }
  });
}

/**
 * Configuration webpack prédéfinie pour la production
 */
export function createProdConfig(options: Omit<WebpackOptions, 'mode'> = {}): Configuration {
  return createWebpackConfig({
    ...options,
    mode: 'production',
    advanced: {
      sourceMaps: false,
      optimization: {
        usedExports: true,
        sideEffects: false
      },
      ...options.advanced
    }
  });
} 