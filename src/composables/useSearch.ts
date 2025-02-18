import { ref, computed } from 'vue'

export function useSearch<T>(items: T[], searchFields: (keyof T)[]) {
  const searchQuery = ref('')

  const filteredItems = computed(() => {
    if (!searchQuery.value) return items

    const queries = searchQuery.value.toLowerCase().split(' ').filter(q => q.length > 0)
    
    return items.filter(item => {
      // Si no hay términos de búsqueda, mostrar todos los items
      if (queries.length === 0) return true

      // Para cada campo de búsqueda
      return searchFields.some(field => {
        const value = item[field]
        if (typeof value !== 'string') return false

        const fieldValue = value.toLowerCase()

        // Para búsqueda exacta (útil para correos)
        if (fieldValue === searchQuery.value.toLowerCase()) return true

        // Para búsqueda por términos separados (útil para nombres completos)
        return queries.every(query => fieldValue.includes(query))
      })
    })
  })

  return {
    searchQuery,
    filteredItems
  }
}
