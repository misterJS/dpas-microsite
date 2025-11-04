/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: string;

  // API Configuration
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // Feature Flags
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_DEBUG_MODE: string;
  readonly VITE_ENABLE_DEVTOOLS: string;

  // External Services
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ANALYTICS_ID?: string;

  // Security
  readonly VITE_CSRF_TOKEN_HEADER: string;
  readonly VITE_SESSION_TIMEOUT: string;

  // UI Configuration
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_SUPPORTED_LANGUAGES: string;
  readonly VITE_THEME: string;

  // Logging
  readonly VITE_LOG_LEVEL: string;

  // Environment Specific
  readonly VITE_DEBUG_API_CALLS?: string;
  readonly VITE_SHOW_PERFORMANCE_METRICS?: string;
  readonly VITE_ENABLE_TEST_DATA?: string;
  readonly VITE_SHOW_ENV_BANNER?: string;
  readonly VITE_ENABLE_COMPRESSION?: string;
  readonly VITE_CACHE_DURATION?: string;

  // Legacy support
  readonly VITE_API_KEY?: string;
  readonly VITE_ENABLE_MOCK_API?: "true" | "false";
  readonly VITE_API_TIMEOUT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
