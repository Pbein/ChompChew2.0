import { NextResponse } from 'next/server'
import { CacheService } from '@/features/core/services/cacheService'
import { createServerComponentClient } from '@/lib/supabase'

export async function GET() {
  try {
    const checks = await Promise.allSettled([
      // Redis health check
      CacheService.healthCheck(),
      
      // Supabase health check
      checkSupabaseHealth(),
      
      // Basic application health
      checkAppHealth()
    ])

    const [redisCheck, supabaseCheck, appCheck] = checks

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        redis: redisCheck.status === 'fulfilled' ? redisCheck.value : { redis: false, message: 'Redis check failed' },
        supabase: supabaseCheck.status === 'fulfilled' ? supabaseCheck.value : { supabase: false, message: 'Supabase check failed' },
        app: appCheck.status === 'fulfilled' ? appCheck.value : { app: false, message: 'App check failed' }
      }
    }

    // Determine overall health status
    const isHealthy = health.services.redis.redis && 
                     health.services.supabase.supabase && 
                     health.services.app.app

    if (!isHealthy) {
      health.status = 'degraded'
    }

    const statusCode = isHealthy ? 200 : 503

    return NextResponse.json(health, { status: statusCode })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function checkSupabaseHealth() {
  try {
    const supabase = await createServerComponentClient()
    
    // Simple query to test connection
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      return {
        supabase: false,
        message: `Supabase error: ${error.message}`
      }
    }

    return {
      supabase: true,
      message: 'Supabase is healthy'
    }
  } catch (error) {
    return {
      supabase: false,
      message: `Supabase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

async function checkAppHealth() {
  try {
    // Basic application checks
    const memoryUsage = process.memoryUsage()
    const uptime = process.uptime()

    return {
      app: true,
      message: 'Application is healthy',
      details: {
        uptime: `${Math.floor(uptime)} seconds`,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
        },
        nodeVersion: process.version,
        platform: process.platform
      }
    }
  } catch (error) {
    return {
      app: false,
      message: `App health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
} 