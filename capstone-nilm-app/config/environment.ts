/**
 * Environment Configuration
 * Controls app behavior for development vs production
 * 
 * ⚠️ DEPLOYMENT NOTE:
 * Set DEVELOPMENT_MODE to false before production deployment
 * to remove Firebase quota optimizations.
 */

export const ENV = {
  /**
   * Development Mode
   * When true: Reduces Firebase writes to conserve free tier quota
   * When false: Full real-time data persistence (production)
   * 
   * 🚀 DEPLOYMENT: Set to false
   */
  DEVELOPMENT_MODE: true,

  /**
   * Data Persistence Interval (milliseconds)
   * Development: 30000 (30 seconds) - saves quota
   * Production: 3000 (3 seconds) - full real-time
   * 
   * 🚀 DEPLOYMENT: Set to 3000
   */
  PERSISTENCE_INTERVAL: 30000, // 30 seconds in dev

  /**
   * Enable Caching
   * When true: Caches recent queries to reduce reads
   * When false: Always fetch fresh data
   * 
   * 🚀 DEPLOYMENT: Can keep true (improves performance)
   */
  ENABLE_CACHING: true,

  /**
   * Cache Duration (milliseconds)
   * How long to cache query results
   * 
   * 🚀 DEPLOYMENT: Adjust based on real-time needs (30000-60000 recommended)
   */
  CACHE_DURATION: 60000, // 1 minute

  /**
   * Simulation Update Interval (milliseconds)
   * How often the UI updates (separate from persistence)
   * 
   * 🚀 DEPLOYMENT: Keep at 3000 for smooth UI
   */
  UI_UPDATE_INTERVAL: 3000, // 3 seconds
};

/**
 * Production Configuration
 * Use this when deploying to production
 */
export const PRODUCTION_ENV = {
  DEVELOPMENT_MODE: false,
  PERSISTENCE_INTERVAL: 3000,
  ENABLE_CACHING: true,
  CACHE_DURATION: 30000,
  UI_UPDATE_INTERVAL: 3000,
};

/**
 * Get current configuration
 */
export const getConfig = () => {
  // You can add logic here to automatically detect environment
  // For now, manually controlled via DEVELOPMENT_MODE
  return ENV;
};

/**
 * Log configuration on startup
 */
export const logConfig = () => {
  console.log('🔧 Environment Configuration:');
  console.log('  Development Mode:', ENV.DEVELOPMENT_MODE ? '✅ ON (Quota Saving)' : '❌ OFF (Full Performance)');
  console.log('  Persistence Interval:', ENV.PERSISTENCE_INTERVAL / 1000, 'seconds');
  console.log('  UI Update Interval:', ENV.UI_UPDATE_INTERVAL / 1000, 'seconds');
  console.log('  Caching:', ENV.ENABLE_CACHING ? '✅ Enabled' : '❌ Disabled');
  
  if (ENV.DEVELOPMENT_MODE) {
    console.log('⚠️  Running in DEVELOPMENT MODE - Firebase writes reduced');
    console.log('📝 Set DEVELOPMENT_MODE to false before deployment');
  }
};
