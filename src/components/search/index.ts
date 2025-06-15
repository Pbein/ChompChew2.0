// Smart Semantic Search Components
export { SmartSemanticSearch } from './SmartSemanticSearch'
export { SearchInput } from './SearchInput'
export { SuggestionPopover } from './SuggestionPopover'
export { SearchChip } from './SearchChip'

// Legacy component (for backward compatibility)
export { HeroSearchBar } from './HeroSearchBar'

// Re-export store types and utilities
export type { 
  SearchQuery, 
  TokenCategory, 
  ParsedToken, 
  SearchChip as SearchChipType 
} from '@/stores/searchStore'

export { 
  useSearchStore, 
  CATEGORY_CONFIG 
} from '@/stores/searchStore' 