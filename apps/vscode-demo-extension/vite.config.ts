import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { useVscodeWebViewPlugin } from 'vite-plugin-use-vscode';

export default defineConfig({
  plugins: [
    // Apply the plugin for the webview build target
    useVscodeWebViewPlugin('webview', {
      // Enable type generation if you want it
      // generateTypes: true,
    }),
    // Apply the plugin for the extension build target
    useVscodeWebViewPlugin('extension', {
      // No specific options needed for the extension target usually
    }),
    react()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Removed build.lib, configure everything in rollupOptions
    rollupOptions: {
      // Configure external dependencies
      external: ['vscode'],
      // Define all inputs explicitly
      input: {
        extension: resolve(__dirname, 'src/web/extension.ts'),
        webview: resolve(__dirname, 'src/web/webview/main.tsx'),
      },
      output: [
        // Output for extension (CJS format)
        {
          dir: 'dist/web',
          entryFileNames: 'extension.js',
          format: 'cjs',
          sourcemap: true, // Keep sourcemaps if needed
        },
        // Output for webview (likely ES format for browser)
        {
          dir: 'dist/webview',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
          format: 'es', // Assuming ES module for webview
          sourcemap: true,
        },
      ]
    }
  },
  base: '/{{base}}/', // Adjust base if needed, may not be necessary for extension/test
  define: {
    // Remove process.env check from React since we're in a web extension
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'), // Ensure NODE_ENV is set
    // For extension/test CJS builds
    'global': 'globalThis',
  }
}); 