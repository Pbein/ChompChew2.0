import { 
  checkUserRole, 
  isAdmin, 
  isPremium, 
  canGenerateRecipes, 
  canAccessPaidFeatures, 
  getUserRoleDisplay,
  type User 
} from './auth-utils'

describe('Auth Utils', () => {
  const mockUsers: Record<string, User> = {
    admin: {
      id: 'admin-123',
      email: 'admin@test.com',
      role: 'admin',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    premium: {
      id: 'premium-123',
      email: 'premium@test.com',
      role: 'premium',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    activeSubscriber: {
      id: 'active-123',
      email: 'active@test.com',
      role: 'free',
      subscription_status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    freeUser: {
      id: 'free-123',
      email: 'free@test.com',
      role: 'free',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    inactiveUser: {
      id: 'inactive-123',
      email: 'inactive@test.com',
      role: 'free',
      subscription_status: 'inactive',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }

  describe('checkUserRole', () => {
    it('should return true for matching role', () => {
      expect(checkUserRole(mockUsers.admin, 'admin')).toBe(true)
      expect(checkUserRole(mockUsers.premium, 'premium')).toBe(true)
      expect(checkUserRole(mockUsers.freeUser, 'free')).toBe(true)
    })

    it('should return false for non-matching role', () => {
      expect(checkUserRole(mockUsers.freeUser, 'admin')).toBe(false)
      expect(checkUserRole(mockUsers.premium, 'free')).toBe(false)
    })

    it('should return false for null user', () => {
      expect(checkUserRole(null, 'admin')).toBe(false)
    })
  })

  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      expect(isAdmin(mockUsers.admin)).toBe(true)
    })

    it('should return false for non-admin users', () => {
      expect(isAdmin(mockUsers.premium)).toBe(false)
      expect(isAdmin(mockUsers.freeUser)).toBe(false)
      expect(isAdmin(null)).toBe(false)
    })
  })

  describe('isPremium', () => {
    it('should return true for premium role', () => {
      expect(isPremium(mockUsers.premium)).toBe(true)
    })

    it('should return true for admin role', () => {
      expect(isPremium(mockUsers.admin)).toBe(true)
    })

    it('should return true for active subscription', () => {
      expect(isPremium(mockUsers.activeSubscriber)).toBe(true)
    })

    it('should return false for free users without active subscription', () => {
      expect(isPremium(mockUsers.freeUser)).toBe(false)
      expect(isPremium(mockUsers.inactiveUser)).toBe(false)
    })

    it('should return false for null user', () => {
      expect(isPremium(null)).toBe(false)
    })
  })

  describe('canGenerateRecipes', () => {
    it('should allow admin users', () => {
      expect(canGenerateRecipes(mockUsers.admin)).toBe(true)
    })

    it('should allow premium users', () => {
      expect(canGenerateRecipes(mockUsers.premium)).toBe(true)
    })

    it('should allow users with active subscription', () => {
      expect(canGenerateRecipes(mockUsers.activeSubscriber)).toBe(true)
    })

    it('should deny free users without subscription', () => {
      expect(canGenerateRecipes(mockUsers.freeUser)).toBe(false)
    })

    it('should deny users with inactive subscription', () => {
      expect(canGenerateRecipes(mockUsers.inactiveUser)).toBe(false)
    })

    it('should deny null users', () => {
      expect(canGenerateRecipes(null)).toBe(false)
    })

    it('should deny users without role', () => {
      const userWithoutRole = {
        ...mockUsers.freeUser,
        role: undefined
      } as User

      expect(canGenerateRecipes(userWithoutRole)).toBe(false)
    })
  })

  describe('canAccessPaidFeatures', () => {
    it('should allow admin users', () => {
      expect(canAccessPaidFeatures(mockUsers.admin)).toBe(true)
    })

    it('should allow premium users', () => {
      expect(canAccessPaidFeatures(mockUsers.premium)).toBe(true)
    })

    it('should allow users with active subscription', () => {
      expect(canAccessPaidFeatures(mockUsers.activeSubscriber)).toBe(true)
    })

    it('should deny free users', () => {
      expect(canAccessPaidFeatures(mockUsers.freeUser)).toBe(false)
    })

    it('should deny null users', () => {
      expect(canAccessPaidFeatures(null)).toBe(false)
    })
  })

  describe('getUserRoleDisplay', () => {
    it('should return correct display names', () => {
      expect(getUserRoleDisplay(mockUsers.admin)).toBe('Administrator')
      expect(getUserRoleDisplay(mockUsers.premium)).toBe('Premium User')
      expect(getUserRoleDisplay(mockUsers.freeUser)).toBe('Free User')
    })

    it('should return Guest for null user', () => {
      expect(getUserRoleDisplay(null)).toBe('Guest')
    })

    it('should default to Free User for undefined role', () => {
      const userWithoutRole = {
        ...mockUsers.freeUser,
        role: undefined
      } as User

      expect(getUserRoleDisplay(userWithoutRole)).toBe('Free User')
    })
  })

  describe('Edge cases', () => {
    it('should handle user with trial subscription status', () => {
      const trialUser: User = {
        id: 'trial-123',
        email: 'trial@test.com',
        role: 'free',
        subscription_status: 'trial',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      // Trial users should not have premium access unless explicitly coded
      expect(canGenerateRecipes(trialUser)).toBe(false)
      expect(isPremium(trialUser)).toBe(false)
    })

    it('should handle user with premium tier but free role', () => {
      const premiumTierUser: User = {
        id: 'tier-123',
        email: 'tier@test.com',
        role: 'free',
        subscription_tier: 'premium',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      // Subscription tier alone shouldn't grant access without active status
      expect(canGenerateRecipes(premiumTierUser)).toBe(false)
    })

    it('should handle user with both premium role and active subscription', () => {
      const doublePrivilegedUser: User = {
        id: 'double-123',
        email: 'double@test.com',
        role: 'premium',
        subscription_status: 'active',
        subscription_tier: 'premium',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      expect(canGenerateRecipes(doublePrivilegedUser)).toBe(true)
      expect(isPremium(doublePrivilegedUser)).toBe(true)
      expect(canAccessPaidFeatures(doublePrivilegedUser)).toBe(true)
    })
  })
}) 